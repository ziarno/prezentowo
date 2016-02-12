/**
 * Comments Collection
 */
Comments = new Mongo.Collection('comments');
Comments.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security


/**
 * SCHEMAS
 */
Comments.Schemas = {};

Comments.Schemas.Main = new SimpleSchema({
  userId: {
    type: String,
    autoValue() {
      return this.userId;
    }
  },
  presentId: {
    type: String
  },
  createdAt: {
    type: Date,
    label: () => _i18n.__('Created'),
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  message: {
    type: String,
    label: () => _i18n.__('Message')
  }
});

Comments.attachSchema(Comments.Schemas.Main);

/**
 * METHODS
 */
Comments.methods = {};

Comments.methods.createComment = new ValidatedMethod({
  name: 'Comments.methods.createComment',
  mixins: [Mixins.loggedIn],
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
    var commentId;
    var presentModifier = {$addToSet: {}};
    var commentsCollectionName = type === 'secret' ? 'commentsSecret' : 'commentsShared';

    commentId = Comments.insert({message, presentId});
    presentModifier.$addToSet[commentsCollectionName] = commentId;
    Presents.update(presentId, presentModifier);
    return commentId;
  }
});

Comments.methods.removeComment = new ValidatedMethod({
  name: 'Comments.methods.removeComment',
  mixins: [Mixins.loggedIn],
  validate: new SimpleSchema({
    commentId: {
      type: String
    }
  }).validator(),
  run({commentId}) {
    return Comments.remove({
      _id: commentId,
      userId: this.userId
    });
  }
});
Comments.after.remove(function (userId, comment) {
  if (!comment.presentId) {
    return;
  }

  return Presents.update(comment.presentId, {
    $pull: {
      commentsSecret: comment._id,
      commentsShared: comment._id
    }
  });
});

Comments.methods.editComment = new ValidatedMethod({
  name: 'Comments.methods.editComment',
  mixins: [Mixins.loggedIn],
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
    });
  }
});