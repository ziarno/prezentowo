import React, { PropTypes } from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

User = ({
  user,
  id = user && user._id,
  picture = user && user.profile.pictureUrl,
  name = user && user.profile.name,
  className,
  large,
  showAddPresentOnHover
}) => {
  const Avatar = (
    <Img
      className="ui avatar image"
      src={picture}
      hideLoader
    />
  )

  return (
    <div
      className={classNames('user', className, { large })}
      data-id={id}
    >
      {showAddPresentOnHover ? (
        <div className="user--picture-wrapper">
          {Avatar}
          <PresentPopup
            buttonClassName="present-button--add circular"
            icon={(
              <i className="large icons">
                <i className="plus icon" />
                <i className="gift corner icon" />
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

User.propTypes = {
  user: PropTypes.object,
  id: PropTypes.string,
  picture: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  large: PropTypes.bool,
  showAddPresentOnHover: PropTypes.bool,
}
