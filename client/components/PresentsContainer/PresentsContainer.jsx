import React from 'react'
import {Autorun} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'
import {createContainer} from 'meteor/react-meteor-data'

PresentsContainer = class PresentsContainer extends React.Component {
  
  constructor() {
    super()
    this.id = 'presents-container'
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
  }

  autorunSetCurrentUser() {
    var visibleUserIds = Session.get('visibleUserIds')
    var currentUser = _.find(this.props.users,
      user => _.contains(visibleUserIds, user._id))
    var isMouseOver = !!$(`#${this.id}:hover`).length

    if (currentUser && isMouseOver) {
      //note: current user from scrolling this component
      // will only be set is mouse is over it
      Session.set('currentUser', currentUser)
    }
  }

  render() {
    var {
      participantsViewMode,
      presentViewMode,
      presents,
      ready,
      event,
      users,
      showUser
      } = this.props
    var isParticipantsViewModeSingle =
      participantsViewMode === 'single'
    var isManyToOne = event.type === 'many-to-one'
    var UserPresentsItems

    if (!ready) {
      let text = isParticipantsViewModeSingle && showUser ?
        showUser.profile.name.capitalizeFirstLetter()
        : null
      return (
        <div id={this.id}>
          <Loader
            inverted
            size="large"
            text={text}
          />
        </div>
      )
    }

    if (isManyToOne) {
      UserPresentsItems = (
        <UserPresents
          users={users}
          presentViewMode={presentViewMode}
          presents={presents}
        />
      )
    } else if (isParticipantsViewModeSingle) {
      UserPresentsItems = (
        <UserPresents
          presentViewMode={presentViewMode}
          users={[showUser]}
          presents={_.filter(
            presents,
            p => p.forUserId === showUser._id
          )}
        />
      )
    } else {
      UserPresentsItems = users.map((user) => (
        <UserPresents
          key={user._id}
          presentViewMode={presentViewMode}
          users={[user]}
          presents={presents.filter((present) => (
            present.forUserId === user._id
          ))}
        />
      ))
    }

    return (
      <div
        id={this.id}>
        {UserPresentsItems}
      </div>
    )
  }
}

PresentsContainer.propTypes = {
  users: React.PropTypes.array.isRequired,

  ready: React.PropTypes.bool.isRequired,
  presents: React.PropTypes.array.isRequired,
  showUser: React.PropTypes.object,
  participantsViewMode: React.PropTypes.string.isRequired,
  event: React.PropTypes.object.isRequired
}

reactMixin(PresentsContainer.prototype, Autorun)

PresentsContainer = createContainer(() => {
  var event = Session.get('event')
  var eventId = event._id
  var currentUser = Session.get('currentUser')
  var user = Meteor.user()
  var participantsViewMode = user &&
    user.settings.viewMode.participantsMode
  var presentViewMode = user &&
    user.settings.viewMode.presentMode
  var subscriptionReady = false
  var forUserId

  if (eventId && !_.isEmpty(currentUser)) {
    forUserId = participantsViewMode === 'single' ?
      currentUser._id : null
    subscriptionReady = Meteor.subscribe('presents', {
      eventId, forUserId
    }).ready()
  }

  return {
    ready: subscriptionReady,
    presents: Presents.find({
      eventId
    }).fetch(),
    showUser: currentUser,
    participantsViewMode,
    presentViewMode,
    event
  }
}, PresentsContainer)