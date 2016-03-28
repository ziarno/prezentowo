import React from 'react'
import {LoggedIn} from '../lib/Mixins'

/**
 * Comments Collection
 */
Comments = new Mongo.Collection('comments')
Comments.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security


/**
 * SCHEMAS
 */
Comments.Schemas = {}

Comments.Schemas.Main = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      return this.userId
    }
  },
  presentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  createdAt: {
    type: Date,
    label: () => _i18n.__('Created'),
    autoValue() {
      if (this.isInsert) {
        return new Date()
      }
    }
  },
  message: {
    type: String,
    label: () => _i18n.__('Message')
  }
})

Comments.attachSchema(Comments.Schemas.Main)

/**
 * METHODS
 */
Comments.methods = {}

Comments.methods.createComment = new ValidatedMethod({
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
    var commentId
    var presentModifier = {$addToSet: {}}
    var commentsCollectionName = type === 'secret' ? 'commentsSecret' : 'commentsShared'

    commentId = Comments.insert({message, presentId})
    presentModifier.$addToSet[commentsCollectionName] = commentId
    Presents.update(presentId, presentModifier)
    return commentId
  }
})

Comments.methods.removeComment = new ValidatedMethod({
  name: 'Comments.methods.removeComment',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    commentId: {
      type: String
    }
  }).validator(),
  run({commentId}) {
    var comment = Comments.find(commentId)
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

Comments.methods.editComment = new ValidatedMethod({
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
      userId: this.userId
    }, {
      $set: {message}
    })
  }
})