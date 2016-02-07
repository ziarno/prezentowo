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
  date: {
    type: Date,
    label: () => _i18n.__('Date'),
    autoValue: () => new Date()
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
      allowedValues: ['secret', 'public']
    },
    message: {
      type: String
    }
  }).validator(),
  run({presentId, type, message}) {
    var commentId;
    var comment = {message, presentId};
    var presentModifier = {$addToSet: {}};
    var commentsCollectionName = type === 'secret' ? 'commentsSecret' : 'commentsPublic';

    commentId = Comments.insert(comment);
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
    var {presentId} = Comments.find(commentId, {fields: {presentId: 1}});
    var commentHasBeenRemoved;

    if (!presentId) {
      throw new Meteor.Error(`${this.name}.noCommentFound`, _i18n.__('Comment not found'));
    }

    commentHasBeenRemoved = Comments.remove({
      _id: commentId,
      userId: this.userId
    });

    if (commentHasBeenRemoved) {
      Presents.update(presentId, {
        $pull: {
          commentsSecret: commentId,
          commentsPublic: commentId
        }
      });
    }

    return commentHasBeenRemoved;
  }
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