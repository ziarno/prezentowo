import React from 'react'
import {Autorun, ScrollableComponent} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'
import {createContainer} from 'meteor/react-meteor-data'

PresentsContainer = class PresentsContainer extends ScrollableComponent {
  
  constructor() {
    super()
    this.id = 'presents-container'
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
    this.getScrollToOptions = this.getScrollToOptions.bind(this)
  }

  isScrollable() {
    var isMouseOver = !!$(`#${this.id}:hover`).length

    return !isMouseOver
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

  render() {
    var isParticipantsViewModeSingle =
      this.props.participantsViewMode === 'single'
    var isManyToOne = this.props.event.type === 'many-to-one'
    var UserPresentsItems

    if (!this.props.ready) {
      let text = isParticipantsViewModeSingle && this.props.showUser ?
        this.props.showUser.profile.name.capitalizeFirstLetter()
        : null
      return (
        <div id={this.id}>
          <Loader
            size="large"
            text={text}
          />
        </div>
      )
    }

    if (isManyToOne) {
      UserPresentsItems = (
        <UserPresents
          users={this.props.users}
          presentViewMode={this.props.presentViewMode}
          presents={this.props.presents}
        />
      )
    } else if (isParticipantsViewModeSingle) {
      UserPresentsItems = (
        <UserPresents
          presentViewMode={this.props.presentViewMode}
          users={[this.props.showUser]}
          presents={this.props.presents}
        />
      )
    } else {
      UserPresentsItems = this.props.users.map((user) => (
        <UserPresents
          key={user._id}
          presentViewMode={this.props.presentViewMode}
          users={[user]}
          presents={this.props.presents.filter((present) => (
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
  scrollToEl: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.object
  ]),
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
  var scrollToEl

  if (eventId && !_.isEmpty(currentUser)) {
    forUserId = participantsViewMode === 'single' ?
      currentUser._id : null
    subscriptionReady = Meteor.subscribe('presents', {
      eventId, forUserId
    }).ready()
    scrollToEl = `#user-presents-${currentUser._id}`
  }

  return {
    ready: subscriptionReady,
    presents: Presents.find().fetch(),
    showUser: currentUser,
    scrollToEl,
    participantsViewMode,
    presentViewMode,
    event
  }
}, PresentsContainer)