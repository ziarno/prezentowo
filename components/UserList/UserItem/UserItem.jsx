UserItem = ({onClick, user, presentsCount}) => (
  <div
    onClick={() => onClick(user._id)}
    className="user-list--item waves-effect">
    <User user={user} />
    <div className="presents-count ui label">
      <i className="gift icon"></i>
      {presentsCount}
    </div>
  </div>
);
