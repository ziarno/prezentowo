import React, { PropTypes } from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

NotificationItem = ({ notification, onClick, clickable }) => {
  return (
    <div
      onClick={onClick}
      className={classNames('notification-item', {
        'is-selectable': clickable,
        'waves-effect': clickable
      })}
    >
      <div className="notification-item--icon">
        <Icon {...notification.getIcon()} size="large" />
      </div>
      <div className="notification-item--content">
        <div className="notification-item--message">
          {notification.getMessageEl()}
        </div>
        <div className="notification-item--hints">
          <DateField
            mode="from"
            className="hint"
            date={notification.createdAt}
          />
          <span className="hint">
            {notification.forEvent.title}
          </span>
        </div>
      </div>
    </div>
  )
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
  onClick: PropTypes.func,
  clickable: PropTypes.bool,
}
