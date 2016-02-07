/**
 * Presents Collection
 */
Presents = new Mongo.Collection('presents');
Presents.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security


/**
 * SCHEMAS
 */
Presents.Schemas = {};

Presents.Schemas.NewPresent = new SimpleSchema({
  title: {
    type: String,
    label: _i18n.__('Title')
  },
  picture: {
    type: String,
    label: _i18n.__('Picture')
  },
  description: {
    type: String,
    label: _i18n.__('Description'),
    optional: true
  },
  eventId: {
    type: String
  },
  forUserId: {
    type: String
  }
});

Presents.Schemas.Main = new SimpleSchema([
  Presents.Schemas.NewPresent,
  {
    buyers: {
      type: [String],
      defaultValue: [],
      label: _i18n.__('Buyers')
    },
    commentsSecret: {
      type: [String],
      defaultValue: [],
      label: _i18n.__('Secret comments')
    },
    commentsShared: {
      type: [String],
      defaultValue: [],
      label: _i18n.__('Shared comments')
    },
    creatorId: {
      type: String,
      autoValue() {
        if (this.isInsert) {
          return this.userId;
        }
      }
    },
    date: {
      type: Date,
      label: () => {_i18n.__('Date')},
      autoValue: () => new Date()
    }
  }
]);

Presents.attachSchema(Presents.Schemas.Main);

/**
 * HELPER FUNCTIONS
 */
Presents.functions = {};

Presents.functions.updatePresentsCount = function (incrementValue, userId, present) {
  var isOwnPresent = (present.forUserId === present.creatorId);
  var countFieldName = isOwnPresent ? 'ownPresentsCount' : 'otherPresentsCount';
  var countModifier = {$inc: {}};
  countModifier.$inc[`participants.$.${countFieldName}`] = incrementValue;
  Events.update({
    _id: present.eventId,
    'participants.userId': present.forUserId
  }, countModifier);
};

/**
 * Collection helpers
 */
Presents.helpers({
  isOwn() {
    return this.forUserId === this.creatorId;
  }
});

/**
 * METHODS
 */
Presents.methods = {};

Presents.methods.createPresent = new ValidatedMethod({
  name: 'Presents.methods.createPresent',
  mixins: [Mixins.loggedIn],
  validate: Presents.Schemas.NewPresent.validator(),
  run(present) {
    if (!Meteor.user().isEventParticipant({eventId: present.eventId})) {
      throw new Meteor.Error(
        `${this.name}.notParticipant`,
        _i18n.__('Not participant'));
    }

    return Presents.insert(present); //auto clean ok - no sub schemas
  }
});
Presents.after.insert(
  Presents.functions.updatePresentsCount.bind(null, 1)
);

Presents.methods.removePresent = new ValidatedMethod({
  name: 'Presents.methods.removePresent',
  mixins: [Mixins.loggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    }
  }).validator(),
  run({presentId}) {
    if (!Meteor.user().hasCreatedPresent(presentId)) {
      throw new Meteor.Error(
        `${this.name}.notCreatedPresent`,
        _i18n.__('Presents deleted by creators'));
    }

    return Presents.remove({
      _id: presentId,
      creatorId: this.userId
    });
  }
});
Presents.after.remove(
  Presents.functions.updatePresentsCount.bind(null, -1)
);

Presents.methods.editPresent = new ValidatedMethod({
  name: 'Presents.methods.editPresent',
  mixins: [Mixins.loggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    },
    present: {
      type: Presents.Schemas.NewPresent.pick(['title', 'description', 'picture'])
    }
  }).validator(),
  run({presentId, present}) {
    var {title, picture, description} = present;

    if (!Meteor.user().hasCreatedPresent(presentId)) {
      throw new Meteor.Error(`${this.name}.notCreatedPresent`, _i18n.__('Presents edited by creators'));
    }

    return Presents.update(presentId, {$set: {
      title, picture, description
    }});
  }
});

Presents.methods.addBuyer = new ValidatedMethod({
  name: 'Presents.methods.addBuyer',
  mixins: [Mixins.loggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    }
  }).validator(),
  run({presentId}) {
    if (!Meteor.user().isEventParticipant({presentId})) {
      throw new Meteor.Error(`${this.name}.notParticipant`, _i18n.__('Not participant'));
    }
    return Presents.update(presentId, {$addToSet: {
      buyers: this.userId
    }});
  }
});

Presents.methods.removeBuyer = new ValidatedMethod({
  name: 'Presents.methods.removeBuyer',
  mixins: [Mixins.loggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    }
  }).validator(),
  run({presentId}) {
    if (!Meteor.user().isEventParticipant({presentId})) {
      throw new Meteor.Error(`${this.name}.notParticipant`, _i18n.__('Not participant'));
    }
    return Presents.update(presentId, {$pull: {
      buyers: this.userId
    }});
  }
});
