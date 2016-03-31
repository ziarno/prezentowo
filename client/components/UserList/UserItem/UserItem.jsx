import React from 'react'
import {isMobile} from '../../../../lib/utilities'

UserItem = ({onClick, onRemove, user, presentsCount, isCreator, active}) => (
  <div
    onClick={() => onClick(user)}
    className={classNames('user-item', {active})}>
    <User user={user} />
    <CountLabel
      icon="gift"
      count={presentsCount}
    />
    {isCreator ? (
      <ParticipantPopup
        onRemove={onRemove}
        popupSettings={{
          hideOnScroll: !isMobile() /* normally hide because popup doesn't reposition, but on mobile don't hide because it also hides on input focus */
        }}
        buttonClassName="user-item--edit small-icon-button"
        icon={(
          <i className="ellipsis vertical icon" />
        )}
        user={user}
      />
    ) : null}
  </div>
)