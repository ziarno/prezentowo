import React from 'react'
import {Autorun} from '../../lib/Mixins'
import reactMixin from 'react-mixin'
import {createContainer} from 'meteor/react-meteor-data'

EventContainer = class EventContainer extends React.Component {
  
  constructor() {
    super()
    this.state = {
      currentUser: Session.get('currentUser'),
      isSidebarVisible: !Session.get('isSidebarFixed')
    }
    this.showUser = this.showUser.bind(this)
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
    this.autorunSetCurrentUserState = this.autorunSetCurrentUserState.bind(this)
    this.autorunSetSidebarMode = this.autorunSetSidebarMode.bind(this)
    this.onSidebarVisibilityChange = this.onSidebarVisibilityChange.bind(this)
  }

  showUser(user) {
    var participantsViewMode =
      this.props.settings.viewMode.participantsMode

    if (participantsViewMode === 'single') {
      FlowRouter.setParams({userId: user._id})
    } else {
      Session.set('currentUser', user)
    }

    this.setState({isSidebarVisible: !Session.get('isSidebarFixed')})
  }

  autorunSetCurrentUserState() {
    //this needs to be here and not props,
    //because we need to react on currentUser changes
    //and props can't do that, because they SET currentUser -
    //if we SET and GET current user in the same reactive function
    // => infinite call stack
    this.setState({currentUser: Session.get('currentUser')})
  }

  autorunSetSidebarMode() {
    this.setState({isSidebarVisible: !Session.get('isSidebarFixed')})
  }

  autorunSetCurrentUser() {
    var userId = FlowRouter.getParam('userId')
    var currentUser = Participants.findOne(userId)

    if (userId && currentUser) {
      Session.set('currentUser', currentUser)
    }
  }

  onSidebarVisibilityChange(isSidebarVisible) {
    this.setState({isSidebarVisible})
  }

  render() {
    var eventTitle = this.props.event &&
      this.props.event.title
    var isManyToOne = this.props.event &&
      this.props.event.type === 'many-to-one'
    var currentUserId = this.state.currentUser &&
      this.state.currentUser._id
    var showUsers

    if (!this.props.ready) {
      return (
        <Loader
          size="large"
          text={eventTitle ?
            _i18n.__('Loading event', {title: eventTitle}) :
          null}
        />
      )
    }

    showUsers = isManyToOne ? (
      _.filter(
        this.props.participants,
        user => this.props.event.beneficiaryIds.indexOf(user._id) > -1
      )
    ) : this.props.participants

    return (
      <div
        id="event-container"
        className={classNames({
          padded: this.state.isSidebarVisible
        })}>

        <Sidebar
          scrollToEl={`.user-list [data-id=${currentUserId}]`}
          isVisible={this.state.isSidebarVisible}
          onVisibilityChange={this.onSidebarVisibilityChange}>
          <UserList
            onUserSelect={this.showUser}
            users={this.props.participants} />
        </Sidebar>

        <PresentsContainer
          users={showUsers} />

        <PresentPopup
          buttonClassName="present-button--add circular primary"
          wrapperClassName="add-present-button"
          icon={(
            <i className="large icons">
              <i className="plus icon"></i>
              <i className="gift corner inverted icon"></i>
            </i>
          )}
          users={isManyToOne ? [] : this.props.participants}
        />

      </div>
    )
  }
  
}

EventContainer.propTypes = {
  eventId: React.PropTypes.string.isRequired,

  ready: React.PropTypes.bool,
  participants: React.PropTypes.array,
  event: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  presents: React.PropTypes.array,
  settings: React.PropTypes.object
}

reactMixin(EventContainer.prototype, Autorun)

EventContainer = createContainer(({eventId, userId}) => {
  var event = Events.findOne(eventId)
  var subsReady = Meteor
    .subscribe('participants', {eventId}, () => {
      Session.set('currentUser', getCurrentUser())
    })
    .ready()
  var participants = Participants
    .find()
    .fetch()
    .sort((participant1, participant2) => {
      var name1 = participant1.profile.name.capitalizeFirstLetter()
      var name2 = participant2.profile.name.capitalizeFirstLetter()

      return name1 > name2 ? 1 : -1
    })
  var user = Meteor.user()
  var currentUser = getCurrentUser()

  function getCorrectPath({participantsViewMode, eventId, userId, isManyToOne}) {
    var path = `/event/id/${eventId}`
    if (participantsViewMode === 'single' && userId && !isManyToOne) {
      path += `/user/${userId}`
    }
    return path
  }

  function getCurrentUser() {
    return userId ? Participants.findOne(userId) : Meteor.user()
  }

  if (subsReady) {
    //move current user to the top
    participants.moveToTop((participant) => (
      participant._id === Meteor.userId()
    ))
    //mix with event participant data
    participants.forEach((participant) => {
      _.extend(participant, _.find(event.participants,
        p => p.userId === participant._id))
    })

    //path should be correct (depending on view mode)
    //no matter how the user got onto the page
    FlowRouter.withReplaceState(function() {
      FlowRouter.go(getCorrectPath({
        participantsViewMode: user.settings &&
          user.settings.viewMode.participantsMode,
        eventId,
        userId: currentUser && currentUser._id,
        isManyToOne: event.type === 'many-to-one'
      }));
    });
  }

  Session.set('event', event || {})

  return {
    ready: subsReady &&
      !_.isEmpty(currentUser),
    participants,
    event,
    currentUser,
    presents: Presents.find().fetch(),
    settings: Meteor.user().settings
  }
}, EventContainer)