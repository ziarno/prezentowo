import React from 'react'
import {LoggedIn} from '../../lib/Mixins'

var CommentsMethods = {}

CommentsMethods.createComment = new ValidatedMethod({
  name: 'Comments.methods.createComment',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    },
    type: {
      type: String,
      allowedValues: ['secret', 'shared']
    },
    message: {
      type: String
    }
  }).validator(),
  run({presentId, type, message}) {
    var present = Presents.findOne(presentId)
    var commentId
    var commentsCollectionName =
      type === 'secret' ? 'commentsSecret' : 'commentsShared'

    commentId = Comments.insert({message, presentId})
    Presents.update(presentId, {
      $addToSet: {
        [commentsCollectionName]: commentId
      }
    })
    Notifications.functions.createNotification({
      type: `present.comment.${type}`,
      action: 'added',
      byUserId: this.userId,
      forUserId: present.forUserId,
      present
    })
    return commentId
  }
})

CommentsMethods.removeComment = new ValidatedMethod({
  name: 'Comments.methods.removeComment',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    commentId: {
      type: String
    }
  }).validator(),
  run({commentId}) {
    var comment = Comments.findOne(commentId)
    var removedCount = Comments.remove({
      _id: commentId,
      userId: this.userId
    })
    Presents.update(comment.presentId, {
      $pull: {
        commentsSecret: comment._id,
        commentsShared: comment._id
      }
    })

    return removedCount
  }
})

CommentsMethods.editComment = new ValidatedMethod({
  name: 'Comments.methods.editComment',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    commentId: {
      type: String
    },
    message: {
      type: String
    }
  }).validator(),
  run({commentId, message}) {
    return Comments.update({
      _id: commentId,
      creatorId: this.userId
    }, {
      $set: {message}
    })
  }
})

export default CommentsMethods