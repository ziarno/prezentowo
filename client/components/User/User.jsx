import React from 'react'

User = ({
  user,
  id = user && user._id,
  picture = user && user.profile.pictureUrl,
  name = user && user.profile.name,
  className,
  large,
  showAddPresentOnHover
}) => {

  var Avatar = (
    <Img
      className="ui avatar image"
      src={picture}
      hideLoader
    />
  )

  return (
    <div
      className={classNames('user', className, {large})}
      data-id={id}>
      {showAddPresentOnHover ? (
        <div className="user--picture-wrapper">
          {Avatar}
          <PresentPopup
            buttonClassName="present-button--add circular"
            icon={(
              <i className="large icons">
                <i className="plus icon"></i>
                <i className="gift corner icon"></i>
              </i>
            )}
            users={[user]}
          />
        </div>
      ) : Avatar}
      <span className="user--name">
        {name}
      </span>
    </div>
  )
}