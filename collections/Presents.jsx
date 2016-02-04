/**
 * Presents Collection
 */
Presents = new Mongo.Collection('Presents');
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
  },
  creatorUserId: {
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
    }
  }
]);

Presents.attachSchema(Presents.Schemas.Main);

/**
 * METHODS
 */
Presents.methods = {};

Presents.methods.addPresent = new ValidatedMethod({
  name: 'Presents.methods.addPresent',
  mixins: [Mixins.loggedIn],
  validate: Presents.Schemas.NewPresent.validator(),
  run(present) {
    if (!Meteor.user().isParticipant(present.eventId)) {
      throw new Meteor.Error(`${this.name}.notParticipant`, _i18n.__('Not participant'));
    }

    return Presents.insert(present); //auto clean ok - no sub schemas
  }
});

Presents.methods.removePresent = new ValidatedMethod({
  name: 'Presents.methods.removePresent',
  mixins: [Mixins.loggedIn],
  validate: (presentId) => {
    check(presentId, String)
  },
  run(presentId) {
    if (!Meteor.user().isParticipant(present.eventId)) {
      throw new Meteor.Error(`${this.name}.notParticipant`, _i18n.__('Not participant'));
    }
    if (!Meteor.user().hasCreatedPresent(presentId)) {
      throw new Meteor.Error(`${this.name}.notParticipant`, _i18n.__('Presents deleted by creators'));
    }

    Presents.remove(presentId);
  }
});