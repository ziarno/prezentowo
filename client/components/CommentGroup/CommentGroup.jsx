import React from 'react'

CommentGroup = ({user, comments}) => {
  return (
    <div className="comment-group">
      <User user={user} />
      <DateField
        className="hint"
        mode="from"
        date={comments[0].createdAt} />
      {comments.map(comment => (
        <ParsedText
          text={comment.message}
          key={comment._id}
          className="comment"
        />
      ))}
    </div>
  )
}