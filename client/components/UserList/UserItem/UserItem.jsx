import React, { PropTypes } from 'react'
import { classNames } from 'meteor/maxharris9:classnames'
import _ from 'underscore'

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
    className={classNames(
      'user-item',
      className,
      { active, disabled }
    )}
  >
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

UserItem.propTypes = {
  onClick: PropTypes.func,
  user: PropTypes.object,
  presentsCount: PropTypes.number,
  showEditButton: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}
