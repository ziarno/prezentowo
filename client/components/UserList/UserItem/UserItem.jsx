UserItem = ({onClick, user, presentsCount, isCreator}) => (
  <div className="user-item">
    <div
      onClick={() => onClick(user)}
      className={classNames('user-item--user waves-effect', {
        'space-right': isCreator
      })}>
      <div>
        <User user={user} />
        <CountLabel
          icon="gift"
          count={presentsCount}
        />
      </div>
    </div>
    {isCreator ? (
      <ParticipantPopup
        buttonClassName="user-item--edit small-icon-button"
        icon={(
          <i className="ellipsis vertical icon" />
        )}
        user={user}
      />
    ) : null}
  </div>
)