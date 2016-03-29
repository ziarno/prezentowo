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
        }, 2000)
      }
    }
  }

  render() {

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
            presents={this.props.presents.filter((present) => (
              present.forUserId === user._id
            ))}
          />
        ))}

      </div>
    )
  }
}

PresentsContainer.propTypes = {
  users: React.PropTypes.array.isRequired,
  presents: React.PropTypes.array.isRequired
}

reactMixin(PresentsContainer.prototype, Autorun)