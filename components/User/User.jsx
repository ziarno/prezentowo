User = ({user, className}) => (
  <div className={classNames('user', className)}>
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