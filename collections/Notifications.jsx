/**
 * Notifications Collection
 */
Notifications = new Mongo.Collection('notifications');
Notifications.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security

/**
 * SCHEMAS
 */
Notifications.Schemas = {};
Notifications.Schemas.Main = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['comment', 'event', 'present']
  },
  action: {
    type: String,
    allowedValues: ['new', 'changed', 'edited']
  },
  createdAt: {
    type: String,
    label: () => _i18n.__('Created'),
    autoValue() {
      if (!this.isSet) {
        return new Date();
      }
    }
  },

  //users to be notified
  seenByUsers: {
    type: [Object]
  },
  'seenByUsers.id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'seenByUsers.seen': {
    type: Boolean
  },

  //user who initiated the notification
  byUser: {
    type: Object
  },
  'byUser.id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'byUser.name': {
    type: String
  },
  'byUser.picture': {
    type: String
  },

  //user who the notification is about (ex. present -> for user)
  forUser: {
    type: Object,
    optional: true
  },
  'forUser.id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'forUser.name': {
    type: String
  },
  'forUser.picture': {
    type: String
  },

  //present that the notification is about
  forPresent: {
    type: Object,
    optional: true
  },
  'forPresent.id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'forPresent.name': {
    type: String
  },
  'forPresent.picture': {
    type: String
  },

  //event that the notification is about
  forEvent: {
    type: Object,
    optional: true
  },
  'forEvent.id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'forEvent.name': {
    type: String
  }
});

Notifications.attachSchema(Notifications.Schemas.Main);