import React from 'react'

NotificationItem = ({notification}) => {
  return (
    <div className="notification-item">
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