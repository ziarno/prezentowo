/**
 * Events Collection
 */
Events = new Mongo.Collection('Events');
Events.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security

/**
 * SCHEMAS
 */
Events.Schemas = {};

Events.Schemas.Participant = new SimpleSchema({
  name: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  ownPresentsCount: {
    type: Number,
    defaultValue: 0
  },
  otherPresentsCount: {
    type: Number,
    defaultValue: 0
  },
  id: {
    type: String,
    optional: true,
    autoValue() {
      var emailField = this.field('email');
      var user = emailField.isSet &&
        Meteor.users.findByEmail(emailField.value);
      var id;

      if (this.isSet) {
        id = this.value;
      } else if (user) {
        id = user._id;
      }

      //watch out to not return false here - only undefined
      return id;
    }
  },
  picture: {
    type: String,
    optional: true,
    autoValue() {
      var emailField = this.field('email');
      var idField = this.field('id');
      var user = idField.isSet ?
        Meteor.users.findOne(idField.value) :
        Meteor.users.findByEmail(emailField.value);
      var picture;

      if (this.isSet) {
        picture = this.value;
      } else if (user) {
        picture = user.profile.picture;
      } else if (emailField.isSet) {
        picture = Gravatar.imageUrl(emailField.value, {secure: true, default: 'mm'});
      }

      return picture;
    }
  }
});

Events.Schemas.Main = new SimpleSchema({
  title: {
    type: String,
    label: () => {_i18n.__('Title')}
  },
  type: {
    type: String,
    label: () => {_i18n.__('Event Type')},
    allowedValues: ['many-to-many', 'many-to-one']
  },
  date: {
    type: Date,
    label: () => {_i18n.__('Date')},
    min: () => {new Date()}
  },
  creator: {
    type: String,
    label: () => {_i18n.__('Creator')},
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
    }
  },
  participants: {
    type: [Events.Schemas.Participant],
    label: () => {_i18n.__('Participants')},
    defaultValue: []
  }
});

Events.attachSchema(Events.Schemas.Main);

/**
 * METHODS
 */
Events.methods = {};

Events.methods.createEvent = new ValidatedMethod({
  name: 'Events.methods.createEvent',
  validate: Events.Schemas.Main.pick([
    'title',
    'type',
    'date'
  ]).validator(),
  run(eventData) {
    if (!this.userId) {
      throw new Meteor.Error(`${this.name}.unauthorized`);
    }

    Events.insert(eventData);
  }
});

Events.methods.addParticipant = new ValidatedMethod({
  name: 'Events.methods.addParticipant',
  validate: new SimpleSchema({
    eventId: {
      type: String
    },
    participant: {
      type: Events.Schemas.Participant.pick(['name', 'email', 'picture', 'id'])
    }
  }).validator(),
  run({eventId, participant}) {
    if (!this.userId) {
      throw new Meteor.Error(`${this.name}.unauthorized`);
    }

    //clean explicitly, because bug in collection2 - this.field('field') doesn't return correct field
    Events.Schemas.Participant.clean(participant);

    Events.update(eventId, {$push: {participants: participant}});
  }
});