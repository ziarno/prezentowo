User = ({user, className, large}) => (
  <div className={classNames('user', className, {
    large: large
  })}>
    <Img
      className="ui avatar image"
      src={user.profile.pictureUrl}
      hideLoader
    />
    <span>
      {user.profile.name}
    </span>
  </div>
);