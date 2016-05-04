import React from 'react'

CommentGroup = ({user, comments}) => {
  var messages = _.reduce(comments, (memo, comment) => (
    `${memo}\n${comment.message}`
  ), '')

  return (
    <div className="comment-group">
      <User user={user} />
      <DateField
        className="hint"
        mode="from"
        date={comments[0].createdAt} />
      <ParsedText
        text={messages}
        className="comment"
      />
    </div>
  )
}