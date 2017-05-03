import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { classNames } from 'meteor/maxharris9:classnames'
import { PopupComponent } from '../../../../lib/Mixins'

NotificationsPopup = class NotificationsPopup extends PopupComponent {

  getPopupSettings() {
    const position = 'bottom right'
    const transition = 'slide down'
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
    const unseenNotificationsCount =
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
    const {
      ready,
      buttonClassName
    } = this.props
    return (
      <div
        ref="popupTrigger"
        onClick={this.showPopup}
        className={classNames(
          'ui compact icon button waves-effect waves-button', {
            loading: !ready
          },
          buttonClassName
        )}
      >
        <i className="alarm outline icon" />
      </div>
    )
  }

  renderPopup() {
    const {
      notifications,
      popupClassName
    } = this.props

    return (
      <div
        ref="popupTarget"
        className={classNames(
          'notifications-popup ui popup',
          popupClassName
        )}
      >

        {notifications.length ? notifications.map(notification => (
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
        )) : (
          <div className="inactive-header">
            <T>No notifications</T>
          </div>
        )}

      </div>
    )
  }
}

NotificationsPopup.propTypes = {
  ready: PropTypes.bool,
  notifications: PropTypes.array,
}

NotificationsPopup = createContainer(function() {
  const subscription = Meteor.subscribe('notifications')

  return {
    ready: subscription.ready(),
    notifications: Notifications.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch()
  }
}, NotificationsPopup)
