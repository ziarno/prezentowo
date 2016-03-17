UserItem = ({onClick, user, presentsCount}) => (
  <div
    onClick={() => onClick(user._id)}
    className="user-list--item waves-effect">
    <User user={user} />
    <CountLabel
      icon="gift"
      count={presentsCount}
    />
  </div>
);
