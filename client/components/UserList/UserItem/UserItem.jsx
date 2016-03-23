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
    {isCreator && (user._id !== Meteor.userId()) ? (
      <div className="waves-effect ui icon button user-item--edit ">
        <i className="ellipsis vertical icon"></i>
      </div>
    ) : null}
  </div>
)