import React from 'react'

Present = ({present, viewMode}) => {
  var isFullWidth = viewMode === 'full-width'

  return (
    <div className={classNames('present', {
      'full-width': isFullWidth
    })}>
      <div className="ui card">
        <Img
          className="image"
          src={present.pictureUrl}
        />

        {present.isUserCreator() ? (
          <PresentPopup
            present={present}
            buttonClassName="edit-present small-icon-button"
            icon={(
              <i className="vertical ellipsis icon"></i>
            )}
            users={[Participants.findOne(present.forUserId)]}
          />
        ) : null}
      </div>
      <Ribbon
        rightFlatEnding={isFullWidth}
        withEndings={!isFullWidth}
        color={present.isOwn() ? 'green' : 'red'}
        small={!isFullWidth}>
        {isFullWidth ? (
          <h1>
            <span>{present.title}</span>
          </h1>
        ) : present.title}
      </Ribbon>
    </div>
  )
}