import React from 'react'

Meteor.publish('comments', function ({presentId, limit = 10}) {
  var present = Presents.find(presentId)
  var commentIds = present.forUserId === this.userId ?
    present.commentsShared :
    [...present.commentsShared, ...present.commentsSecret]

  return Comments.find({
    _id: {
      $in: commentIds
    }
  }, {
    limit: limit,
    sort: {
      date: -1
    }
  })
})