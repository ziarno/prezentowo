UserItem = ({onClick, user, presentsCount, isActive}) => (
  <div
    onClick={() => onClick(user)}
    className="user-item waves-effect">
    <User user={user} />
    <CountLabel
      icon="gift"
      count={presentsCount}
    />
  </div>
)