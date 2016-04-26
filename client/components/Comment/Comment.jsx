import React from 'react'

Comment = ({comment}) => {
  var user = Participants.findOne(comment.creatorId)

  return (
    <div className="ui comment">
      <a className="avatar">
        <Img src={user.profile.pictureUrl} />
      </a>
      <div className="content">
        <span className="author">
          {user.profile.name}
        </span>
        <div className="metadata">
          <DateField
            date={comment.createdAt}
            className="date" />
        </div>
        <div className="text">
          {comment.message}
        </div>
        <div className="actions">
          <a className="reply">Reply</a>
        </div>
      </div>
    </div>
  )
}