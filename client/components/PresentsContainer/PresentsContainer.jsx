import React from 'react'
import ReactDOM from 'react-dom'
import {Autorun, ScrollableComponent} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

PresentsContainer = class PresentsContainer extends ScrollableComponent {
  
  constructor() {
    super()
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
    this.getScrollToOptions = this.getScrollToOptions.bind(this)
  }

  getMeteorData() {
    var eventId = Session.get('event')._id
    var forUserId = this.props.users.length === 1 ?
      this.props.users[0]._id : null

    return {
      ready: Meteor.subscribe('presents', {
        eventId, forUserId
      }).ready(),
      presents: Presents.find().fetch()
    }
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

    if (!this.data.ready) {
      let text = this.props.users.length === 1 ?
        this.props.users[0].profile.name.capitalizeFirstLetter()
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

        {this.props.users.map((user) => (
          <UserPresents
            key={user._id}
            user={user}
            presents={this.data.presents.filter((present) => (
              present.forUserId === user._id
            ))}
          />
        ))}

      </div>
    )
  }
}

PresentsContainer.propTypes = {
  users: React.PropTypes.array.isRequired
}

reactMixin(PresentsContainer.prototype, ReactMeteorData)
reactMixin(PresentsContainer.prototype, Autorun)