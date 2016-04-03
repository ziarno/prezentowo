import React from 'react'
import {Autorun, ScrollableComponent} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'
import {createContainer} from 'meteor/react-meteor-data'

PresentsContainer = class PresentsContainer extends ScrollableComponent {
  
  constructor() {
    super()
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
    this.getScrollToOptions = this.getScrollToOptions.bind(this)
  }

  autorunSetCurrentUser() {
    var visibleUserIds = Session.get('visibleUserIds')
    var currentUser = _.find(this.props.users,
      user => _.contains(visibleUserIds, user._id))

    if (currentUser && this.canSetCurrentUser) {
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
    var UserPresentsItems

    if (!this.props.ready || !this.props.showUser) {
      let text = isParticipantsViewModeSingle && this.props.showUser ?
        this.props.showUser.profile.name.capitalizeFirstLetter()
        : null
      return (
        <div id="presents-container">
          <Loader
            size="large"
            text={text}
          />
        </div>
      )
    }

    if (isParticipantsViewModeSingle) {
      UserPresentsItems = (
        <UserPresents
          presentViewMode={this.props.presentViewMode}
          user={this.props.showUser}
          presents={this.props.presents}
        />
      )
    } else {
      UserPresentsItems = this.props.users.map((user) => (
        <UserPresents
          key={user._id}
          presentViewMode={this.props.presentViewMode}
          user={user}
          presents={this.props.presents.filter((present) => (
            present.forUserId === user._id
          ))}
        />
      ))
    }

    return (
      <div
        id="presents-container"
        onMouseEnter={() => {
          this.canSetCurrentUser = true
          this.isScrollable = false
        }}
        onMouseLeave={() => {
          this.canSetCurrentUser = false
          this.isScrollable = true
        }}>

        {UserPresentsItems}

      </div>
    )
  }
}

PresentsContainer.propTypes = {
  ready: React.PropTypes.bool.isRequired,
  users: React.PropTypes.array.isRequired,
  showUser: React.PropTypes.object.isRequired,
  participantsViewMode: React.PropTypes.string.isRequired
}

reactMixin(PresentsContainer.prototype, Autorun)

PresentsContainer = createContainer(() => {
  var eventId = Session.get('event')._id
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
  }
}, PresentsContainer)