UserItem = ({onClick, user, presentsCount, isCreator}) => (
  <div className="user-item">
    <div
      onClick={() => onClick(user)}
      className={classNames('user-item--user waves-effect', {
        'space-right': isCreator
      })}>
      <User user={user} />
      <CountLabel
        icon="gift"
        count={presentsCount}
      />
    </div>
    {isCreator && (user._id !== Meteor.userId()) ? (
      <i className="user-item--edit waves-effect ellipsis vertical icon"></i>
    ) : null}
  </div>
)