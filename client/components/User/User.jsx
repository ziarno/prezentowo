import React from 'react'

User = ({user, className, large, showAddPresentOnHover}) => {
  var Avatar = (
    <Img
      className="ui avatar image"
      src={user.profile.pictureUrl}
      hideLoader
    />
  )

  return (
    <div
      className={classNames('user', className, {large})}
      data-id={user._id}>
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
        {user.profile.name}
      </span>
    </div>
  )
}