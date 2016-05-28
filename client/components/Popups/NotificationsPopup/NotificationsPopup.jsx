import React from 'react'
import {PopupComponent} from '../../../../lib/Mixins'
import {createContainer} from 'meteor/react-meteor-data'
import reactMixin from 'react-mixin'

NotificationsPopup = class NotificationsPopup extends PopupComponent {

  getPopupSettings() {
    var position = 'bottom right'
    var transition = 'slide down'
    return {
      onVisible() {
        Notifications.methods.seeAllNotifications.call()
      },
      position,
      lastResort: position,
      transition
    }
  }

  renderAdditionalContent() {
    var unseenNotificationsCount =
      Notifications.functions.getUnseenCount()

    if (unseenNotificationsCount === 0) {
      return null
    }

    return (
      <div className="ui red label notifications-count">
        {unseenNotificationsCount}
      </div>
    )
  }

  renderTrigger() {
    return (
      <div
        ref="popupTrigger"
        onClick={this.showPopup}
        className={classNames(
          'ui compact icon button',
          'waves-effect waves-button', {
            loading: !this.props.ready
          },
          this.props.buttonClassName)}>
        <i className="alarm outline icon"></i>
      </div>
    )
  }

  renderPopup() {
    var {notifications} = this.props

    return (
      <div
        ref="popupTarget"
        className={classNames(
        'notifications-popup ui popup',
        this.props.popupClassName)}>

        {notifications.map(notification => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            clickable={notification.isShowable()}
            onClick={() => {
              if (notification.isShowable()) {
                this.hidePopup()
                notification.show()
              }
            }}
          />
        ))}

      </div>
    )
  }

}

NotificationsPopup.propTypes = {
  ready: React.PropTypes.bool,
  notifications: React.PropTypes.array,
}

NotificationsPopup = createContainer(function() {
  var subscription = Meteor.subscribe('notifications')

  return {
    ready: subscription.ready(),
    notifications: Notifications.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch()
  }
}, NotificationsPopup)