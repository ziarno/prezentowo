import React from 'react'
import ReactDOM from 'react-dom'
import {Autorun, ScrollableComponent} from '../../lib/Mixins'
import reactMixin from 'react-mixin'
import {createContainer} from 'meteor/react-meteor-data'

EventContainer = class EventContainer extends ScrollableComponent {
  
  constructor() {
    super()
    this.state = {
      currentUser: Session.get('currentUser'),
      isSidebarVisible: !Session.get('isSidebarFixed'),
      isRequestJoinProcessing: false
    }
    this.showUser = this.showUser.bind(this)
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
    this.autorunSetCurrentUserState = this.autorunSetCurrentUserState.bind(this)
    this.autorunSetSidebarMode = this.autorunSetSidebarMode.bind(this)
    this.onSidebarVisibilityChange = this.onSidebarVisibilityChange.bind(this)
    this.onAfterSidebarVisibilityChange = this.onAfterSidebarVisibilityChange.bind(this)
    this.requestJoin = this.requestJoin.bind(this)
    this.setScrollSpy = this.setScrollSpy.bind(this)
    this.getScrollToOptions = this.getScrollToOptions.bind(this)
  }

  showUser(user) {
    var participantsViewMode = this.props.settings ?
      this.props.settings.viewMode.participantsMode :
      Users.defaults.participantsMode

    if (participantsViewMode === 'single') {
      FlowRouter.setParams({userId: user._id})
    } else {
      Session.set('currentUser', user)
    }

    this.setState({isSidebarVisible: !Session.get('isSidebarFixed')})
    ModalManager.close()
    ModalManager.destroy()
  }

  autorunSetCurrentUserState() {
    //this needs to be here and not props,
    //because we need to react on currentUser changes
    //and props can't do that, because they SET currentUser -
    //if we SET and GET current user in the same reactive function
    // => infinite call stack
    var currentUser = Session.get('currentUser')
    this.setState({currentUser})
    if (currentUser) {
      this.scrollTo(`#user-presents-${currentUser._id}`)
    }
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

  getScrollToOptions() {
    return {
      offset: -75,
      onAfter: ($scrollToEl) => {
        var userEl = $scrollToEl
          .find('.user')
          .addClass('waves-effect waves-button')

        Waves.ripple(userEl)
        setTimeout(() => {
          userEl.removeClass('waves-effect waves-button')
          Waves.calm(userEl)
        }, 1500)
      }
    }
  }

  onSidebarVisibilityChange(isSidebarVisible) {
    this.setState({isSidebarVisible})
  }

  componentWillMount() {
    $(document.body).toggleClass(
      'sidebar-visible',
      this.state.isSidebarVisible
    )
  }

  componentWillUpdate(newProps, newState) {
    if (this.state.isSidebarVisible !== newState.isSidebarVisible) {
      $(document.body).toggleClass(
        'sidebar-visible',
        newState.isSidebarVisible
      )
    }
  }

  componentDidMount() {
    this.setScrollSpy()
  }

  componentDidUpdate() {
    this.setScrollSpy()
  }

  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this))
      .visibilitySpy({
        action: 'stop'
      })
  }

  onAfterSidebarVisibilityChange() {
    if (!Session.get('isSidebarFixed')) {
      ModalManager.refresh()
    }
  }

  setScrollSpy() {
    $(ReactDOM.findDOMNode(this))
      .visibilitySpy({
        spyOn: '.user.large',
        offsetTop: 10,
        onChange(visibleUsers) {
          Session.set('visibleUserIds', _.map(visibleUsers, user => (
            $(user).attr('data-id')
          )))
        }
      })
  }

  isScrollable() {
    var isMouseOver = $('#presents-container:hover').length
    return !isMouseOver && !ModalManager.isOpen()
  }

  requestJoin() {
    this.setState({isRequestJoinProcessing: true})
    Events.methods.requestJoin.call({
      eventId: this.props.eventId
    }, () => {
      this.setState({isRequestJoinProcessing: false})
    })
  }

  render() {
    var {event, participants, ready} = this.props
    var eventTitle = event && event.title
    var isManyToOne = event &&
      event.type === 'many-to-one'
    var currentUserId = this.state.currentUser &&
      this.state.currentUser._id
    var showUsers
    var isUserParticipant = Events.functions.isUserParticipant({
      eventId: event && event._id,
      participantId: Meteor.userId()
    })
    var creator = event && _.find(participants,
      p => p._id === event.creatorId)
    var joinRequestSent = participants.length &&
      !!_.find(participants, p =>
        p._id === Meteor.userId() && p.status === 'requestingJoin')

    showUsers = ready && (isManyToOne ? (
        participants.filter(user =>
          event.beneficiaryIds.indexOf(user._id) > -1
        )
      ) : participants)
      .filter(user =>
        user.status === 'isInvited' ||
        user.status === 'isAccepted'
      )

    return (
      <div
        ref="scrollContainer"
        id="event-container"
        className={classNames({
          empty: !isUserParticipant,
          loading: !ready
        })}>

        {!ready ? (
          <Loader
            inverted
            size="large"
            text={eventTitle ?
                _i18n.__('Loading event', {title: eventTitle}) :
              null}
          />
        ) : null}

        {ready ? (
          <Sidebar
            scrollToEl={`.user-list [data-id=${currentUserId}]`}
            isVisible={this.state.isSidebarVisible}
            onVisibilityChange=
              {this.onSidebarVisibilityChange}
            onAfterVisibilityChange={this.onAfterSidebarVisibilityChange}>
            <UserList
              onUserSelect={this.showUser}
              users={participants} />
          </Sidebar>
        ) : null}

        {ready && isUserParticipant ? (
          <PresentsContainer
            users={showUsers} />
        ) : null}

        {ready && isUserParticipant ? (
          <PresentPopup
            buttonClassName="present-button--add circular primary"
            wrapperClassName="add-present-button"
            icon={(
              <i className="large icons">
                <i className="plus icon"></i>
                <i className="gift corner inverted icon"></i>
              </i>
            )}
            users={isManyToOne ? [] : participants}
            popupSettings={{
              position: 'top right',
              lastResort: 'top right'
            }}
          />
        ) : null}

        {ready && !isUserParticipant ? (
          <div className="event-message">
            <p>
              <T>Welcome to event</T>
            </p>
            <p className="event-message--styled-title">
              {event && event.title}
            </p>
            <div className="event-message--created-by">
              <T>created by</T>
              <span>:&nbsp;</span>
              <User user={creator}></User>
            </div>
            <div className="ui message">
              {joinRequestSent ? (
                <div>
                  <p><T>hints.joinRequestSent</T></p>
                  <p><T>hints.awaitCreatorConfirmation</T></p>
                </div>
              ) : Meteor.user() ? (
                <button
                  onClick={this.requestJoin}
                  className={classNames(
                    'ui left labeled icon button',
                    'waves-effect waves-button', {
                    loading: this.state.isRequestJoinProcessing
                    })}>
                  <i className="add user icon" />
                  <T>Join event</T>
                </button>
              ) : (
                <p className="translations">
                  <a href="/sign-in">
                    <T>Login</T>
                  </a>
                  <T>or</T>
                  <a href="/sign-up">
                    <T>Register</T>
                  </a>
                  <T>to join this event</T>
                </p>
              )}
            </div>
          </div>
        ) : null}

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
    .subscribe('eventDetails', {eventId}, () => {
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

  function getCorrectPath({
      participantsViewMode, eventId, userId, isManyToOne
    }) {
    var path = `/event/id/${eventId}`
    if (participantsViewMode === 'single' &&
        userId &&
        !isManyToOne &&
        Events.functions.isUserParticipant({
          eventId, participantId: userId
        })
      ) {
      path += `/user/${userId}`
    }
    return path
  }

  function getCurrentUser() {
    return userId && Participants.findOne(userId) || Meteor.user()
  }

  if (subsReady) {
    //move yourself to the top
    participants.moveToTop((participant) => (
      participant._id === Meteor.userId()
    ))
    //mix with event participant data
    participants.forEach((participant) => {
      _.extend(participant, _.find(event.participants,
        p => p.userId === participant._id))
    })
    Session.set('participantIds', participants.map(p => p._id))

    //path should be correct (depending on view mode)
    //no matter how the user got onto the page
    FlowRouter.withReplaceState(function() {
      FlowRouter.go(getCorrectPath({
        participantsViewMode: user && user.settings &&
          user.settings.viewMode.participantsMode,
        eventId,
        userId: currentUser && currentUser._id,
        isManyToOne: event && event.type === 'many-to-one'
      }));
    });
  }

  Session.set('event', event || {})

  return {
    ready: subsReady,
    participants,
    event,
    currentUser,
    presents: Presents.find().fetch(),
    settings: user && user.settings
  }
}, EventContainer)