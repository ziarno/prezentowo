User = ({user}) => (
  <div className="user">
    <Img
      className="ui avatar image"
      src={user.profile.pictureUrl.small}
      hideLoader
    />
    <span>
      {user.profile.name}
    </span>
  </div>
);