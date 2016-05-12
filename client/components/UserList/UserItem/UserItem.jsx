import React from 'react'

UserItem = ({
  onClick,
  user,
  presentsCount,
  showEditButton,
  active,
  disabled,
  children,
  className
  }) => (
  <div
    onClick={() => !disabled && onClick && onClick(user)}
    className={classNames('user-item', className, {
      active,
      disabled})}>
    <User user={user} />
    {_.isNumber(presentsCount) ? (
      <CountLabel
        icon="gift"
        count={presentsCount}
      />
    ) : null}
    {showEditButton ? (
      <ParticipantPopup
        buttonClassName="user-item--edit small-icon-button"
        icon={(
          <i className="ellipsis vertical icon" />
        )}
        user={user}
      />
    ) : null}
    {children}
  </div>
)