User = ({user, className, large}) => (
  <div
    className={classNames('user', className, {
      large: large
    })}
    data-id={user._id}>
    <Img
      className="ui avatar image"
      src={user.profile.pictureUrl}
      hideLoader
    />
    <span>
      {user.profile.name}
    </span>
  </div>
)