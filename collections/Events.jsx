/** * Events Collection */Events = new Mongo.Collection('Events');Events.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security/** * SCHEMAS */Events.Schemas = {};Events.Schemas.NewParticipant = new SimpleSchema({  name: {    type: String  },  email: {    type: String,    regEx: SimpleSchema.RegEx.Email,    optional: true  },  picture: {    type: String,    optional: true  },  gender: {    type: String,    allowedValues: ['male', 'female'],    defaultValue: 'male'  }});Events.Schemas.Participant = new SimpleSchema({  userId: {    type: String,    optional: true  },  ownPresentsCount: {    type: Number,    defaultValue: 0  },  otherPresentsCount: {    type: Number,    defaultValue: 0  },  accepted: {    type: String,    allowedValues: ['pending', 'accepted', 'rejected'],    defaultValue: 'pending'  }});Events.Schemas.Main = new SimpleSchema({  title: {    type: String,    label: () => {_i18n.__('Title')}  },  type: {    type: String,    label: () => {_i18n.__('Event Type')},    allowedValues: ['many-to-many', 'many-to-one']  },  date: {    type: Date,    label: () => {_i18n.__('Date')},    min: () => {new Date()}  },  creatorId: {    type: String,    label: () => {_i18n.__('Creator')},    autoValue() {      if (this.isInsert) {        return this.userId;      }    }  },  participants: {    type: [Events.Schemas.Participant],    label: () => {_i18n.__('Participants')},    defaultValue: []  }});Events.attachSchema(Events.Schemas.Main);/** * HELPER FUNCTIONS */Events.functions = {};Events.functions.addParticipant = function ({eventId, participant}) {  Events.Schemas.Participant.clean(participant); //clean explicitly, because bug in collection2 for autoValue and defaultValue - this.field('field') doesn't return correct field in sub schemas. Note: use Events.Schemas.Participant (not NewParticipant) so basically convert from NewParticipant to Participant  Events.update(eventId, {$push: {participants: participant}});};/** * METHODS */Events.methods = {};Events.methods.createEvent = new ValidatedMethod({  name: 'Events.methods.createEvent',  mixins: [Mixins.loggedIn],  validate: Events.Schemas.Main    .pick(['title', 'type', 'date'])    .validator(),  run(eventData) {    var eventId;    eventId = Events.insert(eventData);    Events.functions.addParticipant({      eventId,      participant: {        userId: this.userId,        accepted: 'accepted'      }    });    return eventId;  }});Events.methods.addParticipant = new ValidatedMethod({  name: 'Events.methods.addParticipant',  mixins: [Mixins.loggedIn],  validate: new SimpleSchema({    eventId: {      type: String    },    participant: {      type: Events.Schemas.NewParticipant    }  }).validator(),  run({eventId, participant}) {    if (this.isSimulation) {      //Note: no latency compensation. Add in the future?      return;    }    var user = Meteor.users.findByEmail(participant.email);    var event = Events.findOne(eventId);    if (!event) {      throw new Meteor.Error(`${this.name}.eventNotFound`, _i18n.__('No event', {eventId}));    }    if (this.userId !== event.creatorId) {      throw new Meteor.Error(`${this.name}.unauthorized`, _i18n.__('Only creator can add', {eventId}));    }    if (user) {      //if user's email exists, just use his id      participant.userId = user._id;    } else {      //if not, create a new temporary user      participant.userId = Meteor.users.insert({        profile: {          ...participant,          isTemp: true        }      });    }    Events.functions.addParticipant({eventId, participant});  }});Events.methods.removeParticipant = new ValidatedMethod({  name: 'Events.methods.removeParticipant',  mixins: [Mixins.loggedIn],  validate: new SimpleSchema({    eventId: {      type: String    },    participantId: {      type: String    }  }).validator(),  run({eventId, participantId}) {    var event = Events.findOne(eventId);    if (!event) {      throw new Meteor.Error(`${this.name}.eventNotFound`, _i18n.__('No event', {eventId}));    }    if (event.creatorId !== this.userId && participantId !== this.userId) {      throw new Meteor.Error(`${this.name}.unauthorized`, _i18n.__('Only creator can remove participants'));    }    if (event.creatorId === participantId) {      throw new Meteor.Error(`${this.name}.creatorCannotBeRemoved`, _i18n.__('Remove creator'));    }    Events.update(eventId, {      $pull: {        participants: {userId: participantId}      }    });  }});