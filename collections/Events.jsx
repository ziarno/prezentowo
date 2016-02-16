/** * Events Collection */Events = new Mongo.Collection('events');Events.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security/** * SCHEMAS */Events.Schemas = {};Events.Schemas.NewParticipant = new SimpleSchema({  name: {    type: String  },  email: {    type: String,    regEx: SimpleSchema.RegEx.Email,    optional: true  },  pictureUrl: {    type: SimpleSchema.RegEx.Url,    optional: true  },  gender: {    type: String,    optional: true,    allowedValues: ['male', 'female'],    defaultValue: 'male'  }});Events.Schemas.Participant = new SimpleSchema({  userId: {    type: String,    regEx: SimpleSchema.RegEx.Id,    optional: true  },  ownPresentsCount: {    type: Number,    defaultValue: 0  },  otherPresentsCount: {    type: Number,    defaultValue: 0  },  invitation: {    type: Object,    optional: true  },  'invitation.id': {    type: String,    regEx: SimpleSchema.RegEx.Id,    optional: true  },  'invitation.status': {    type: String,    allowedValues: ['accepted', 'pending', 'rejected'],    defaultValue: 'pending'  }});Events.Schemas.Main = new SimpleSchema({  title: {    type: String,    max: 55,    label: () => _i18n.__('Title')  },  type: {    type: String,    label: () => _i18n.__('Event Type'),    allowedValues: ['many-to-many', 'many-to-one']  },  date: {    type: Date,    label: () => _i18n.__('Date'),    min: () => new Date()  },  createdAt: {    type: Date,    label: () => _i18n.__('Created'),    autoValue() {      if (this.isInsert) {        return new Date();      }    }  },  creatorId: {    type: String,    regEx: SimpleSchema.RegEx.Id,    label: () => _i18n.__('Creator'),    autoValue() {      if (this.isSet) {        return this.value;      }      if (this.isInsert) {        return this.userId;      }    }  },  participants: {    type: [Events.Schemas.Participant],    label: () => _i18n.__('Participants'),    defaultValue: []  }});Events.attachSchema(Events.Schemas.Main);/** * HELPER FUNCTIONS */Events.functions = {};Events.functions.addParticipant = function ({eventId, participant}) {  Events.Schemas.Participant.clean(participant); //clean explicitly, because bug in collection2 for autoValue and defaultValue - this.field('field') doesn't return correct field in sub schemas. Note: use Events.Schemas.Participant (not NewParticipant) so basically convert from NewParticipant to Participant  return Events.update(eventId, {$push: {participants: participant}});};Events.functions.isUserParticipant = function ({eventId, participantId}) {  return !!Events.findOne({    _id: eventId,    participants: {      $elemMatch: {        userId: participantId      }    }  });};Events.functions.setInvitationStatus = function ({eventId, participantId, status}) {  return Events.update({    _id: eventId,    'participants.userId': participantId  }, {    $set: {      'participants.$.invitation.status': status    }  })};/** * METHODS */Events.methods = {};Events.methods.createEvent = new ValidatedMethod({  name: 'Events.methods.createEvent',  mixins: [Mixins.loggedIn],  validate: Events.Schemas.Main    .pick(['title', 'type', 'date'])    .validator(),  run(eventData) {    var eventId;    eventId = Events.insert(eventData);    Events.functions.addParticipant({      eventId,      participant: {        userId: this.userId,        invitation: {          status: 'accepted'        }      }    });    return eventId;  }});Events.methods.addParticipant = new ValidatedMethod({  name: 'Events.methods.addParticipant',  mixins: [Mixins.loggedIn],  validate: new SimpleSchema({    eventId: {      type: String    },    participant: {      type: Events.Schemas.NewParticipant    }  }).validator(),  run({eventId, participant}) {    if (this.isSimulation) {      //Note: no latency compensation. Add in the future?      return;    }    var user = Meteor.users.findByEmail(participant.email);    var event = Events.findOne(eventId);    var invitationId;    var isTemp = false;    function createTempUser({name, gender, pictureUrl, email}) {      var user = {profile: {name, gender}};      if (pictureUrl) {        user.profile.pictureUrl = {          large: pictureUrl,          small: pictureUrl        };      }      if (email) {        user.registered_emails = [{          address: email,          verified: false        }];      }      user.isTemp = true;      return Meteor.users.insert(user);    }    //security checks    if (!event) {      throw new Meteor.Error(`${this.name}.eventNotFound`, _i18n.__('No event', {eventId}));    }    if (this.userId !== event.creatorId) {      throw new Meteor.Error(`${this.name}.unauthorized`, _i18n.__('Only creator can add', {eventId}));    }    if (user && _.find(event.participants, (participant) => participant.userId === user._id)) {      throw new Meteor.Error(`${this.name}.alreadyParticipant`, _i18n.__('This user is already a participant', {eventId}));    }    //user check    if (user) {      //if user's email exists, just use his id      participant.userId = user._id;    } else {      //if not, create a new TEMPORARY user      isTemp = true;      participant.userId = createTempUser(participant);    }    //create invitation    invitationId = Invitations.insert({      forEventId: eventId,      forUserId: participant.userId,      isForTempUser: isTemp    });    participant.invitation = {      id: invitationId,      status: 'pending'    };    return Events.functions.addParticipant({eventId, participant});  }});Events.methods.removeParticipant = new ValidatedMethod({  name: 'Events.methods.removeParticipant',  mixins: [Mixins.loggedIn],  validate: new SimpleSchema({    eventId: {      type: String    },    participantId: {      type: String    }  }).validator(),  run({eventId, participantId}) {    var event = Events.findOne(eventId);    if (!event) {      throw new Meteor.Error(`${this.name}.eventNotFound`, _i18n.__('No event', {eventId}));    }    if (event.creatorId === participantId) {      throw new Meteor.Error(`${this.name}.creatorCannotBeRemoved`, _i18n.__('Remove creator'));    }    if (event.creatorId !== this.userId) {      throw new Meteor.Error(`${this.name}.unauthorized`, _i18n.__('Only creator can remove participants'));    }    Events.update({      _id: eventId,      creatorId: this.userId    }, {      $pull: {        participants: {          userId: participantId        }      }    });    Meteor.users.remove({      _id: participantId,      isTemp: true    });  }});