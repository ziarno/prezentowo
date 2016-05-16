import React from 'react'import {LoggedIn} from '../lib/Mixins'/** * Events Collection */Events = new Mongo.Collection('events')Events.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security/** * SCHEMAS */Events.Schemas = {}Events.Schemas.NewParticipant = new SimpleSchema({  participantId: {    ...SchemaFields.Id,    optional: true  },  name: SchemaFields.Name,  email: {    ...SchemaFields.Email,    optional: true  },  pictureUrl: SchemaFields.PictureUrl,  gender: SchemaFields.Gender})Events.Schemas.Participant = new SimpleSchema({  userId: SchemaFields.Id,  ownPresentsCount: {    type: Number,    defaultValue: 0  },  otherPresentsCount: {    type: Number,    defaultValue: 0  },  status: {    type: String,    allowedValues: [      'isInvited',      'isAccepted',      'requestingJoin',      'isRemoved',      'isTemp'    ]  }})Events.Schemas.Main = new SimpleSchema({  title: {    type: String,    max: 55,    label: () => _i18n.__('Title')  },  type: {    type: String,    label: () => _i18n.__('Event Type'),    allowedValues: ['many-to-many', 'many-to-one']  },  date: {    ...SchemaFields.Date,    min: () => new Date()  },  createdAt: SchemaFields.CreatedAt,  creatorId: SchemaFields.CreatorId,  beneficiaryIds: {    type: [String],    regEx: SimpleSchema.RegEx.Id,    defaultValue: []  },  //only relevant in many-to-one events  ownPresentsCount: {    type: Number,    defaultValue: 0  },  //only relevant in many-to-one events  otherPresentsCount: {    type: Number,    defaultValue: 0  },  participants: {    type: [Events.Schemas.Participant],    label: () => _i18n.__('Participants'),    defaultValue: []  },  participantsCount: {    type: Number,    defaultValue: 0  }})Events.attachSchema(Events.Schemas.Main)/** * HELPER FUNCTIONS */Events.functions = {}Events.functions.addParticipant = function ({eventId, participant}) {  //clean explicitly, because bug in collection2 for autoValue  // and defaultValue - this.field('field') doesn't return  // correct field in sub schemas.  // Note: use Events.Schemas.Participant (not NewParticipant)  // so basically convert from NewParticipant to Participant  Events.Schemas.Participant.clean(participant)  //in case participant was removed by setting the 'isRemoved'  //status - just update the existing user  var updatedCount = Events.update({    _id: eventId,    participants: {      $elemMatch: {        userId: participant.userId      }    }  }, {    $set: {      'participants.$': participant    }  })  if (updatedCount === 0) {    //participant wasn't on the list already - add new one    Events.update(eventId, {      $inc: {        participantsCount: 1      },      $push: {        participants: participant      }    })  } else {    Events.update(eventId, {      $inc: {        participantsCount: 1      }    })  }}Events.functions.removeParticipant = function ({    eventId,    participantId,    event = Events.findOne(eventId)  }) {  var modifier = {    $inc: {      participantsCount: -1    },    $pull: {      beneficiaryIds: participantId    }  }  var user = Users.findOne(participantId)  if (user && user.isTemp) {    modifier.$pull.participants = {      userId: participantId    }    Users.functions.removeTempUsers({      _id: participantId    })  } else {    modifier.$set = {      'participants.$.status': 'isRemoved'    }  }  Events.update({    _id: eventId,    participants: {      $elemMatch: {        userId: participantId      }    }  }, modifier)  Presents.functions.removePresents({    forUserId: participantId  })  Events.functions.updateEventPresentCounts(event)}Events.functions.participant = function ({    eventId,    participantId,    event = Events.findOne({      _id: eventId,      participants: {        $elemMatch: {          userId: participantId        }      }    }, {      fields: {        participants: 1      }    }),  }) {  var participant = event && _.find(event.participants,    p => p.userId === participantId)  return {    isAccepted() {      return participant && participant.status === 'isAccepted'    },    isParticipant() {      return participant && participant.status !== 'isRemoved'    }  }}Events.functions.getAcceptedParticipants = function({    eventId,    event = Events.findOne(eventId, {      fields: {        participants: 1      }    })  }) {  return _.filter(event.participants,    p => p.status === 'isAccepted')}Events.functions.check = function ({  eventId,  event = Events.findOne(eventId)  }) {  if (!event) {    throw new Meteor.Error('eventNotFound',      _i18n.__('No event', {eventId}))  }  function isParticipant(userId) {    return Events.functions.participant({      event, participantId: userId    }).isParticipant()  }  return {    event,    isEventCreator(userId) {      if (userId !== event.creatorId) {        throw new Meteor.Error('unauthorized',          _i18n.__('Not event creator', {eventId}))      }      return this    },    isNotEventCreator(userId) {      if (userId === event.creatorId) {        throw new Meteor.Error(`creatorCannotBeRemoved`,          _i18n.__('Remove creator'))      }      return this    },    isNotParticipant(userId) {      if (isParticipant(userId)) {        throw new Meteor.Error(`alreadyParticipant`,          _i18n.__('This user is already a participant', {eventId}))      }      return this    },    isParticipant(userId) {      if (!isParticipant(userId)) {        throw new Meteor.Error(`unauthorized`)      }      return this    },    isManyToOne() {      if (event.type !== 'many-to-one') {        throw new Meteor.Error('Wrong event type',          'Event is not of type \'many-to-one\'')      }      return this    }  }}Events.functions.getPresentsCount = function (event) {  var isManyToOne = event && event.type === 'many-to-one'  if (isManyToOne) {    return Users.functions.isBeneficiary(event, Meteor.userId()) ?      event.ownPresentsCount :      (event.ownPresentsCount + event.otherPresentsCount)  }  //in the case of 'single' participants mode, we can't just count the presents  //because only those for a particular user are being published - that's why we must keep  //track of their count in the event  return event && event.participants &&    _.reduce(event.participants, (memo, participant) => {      return (        participant.userId === Meteor.userId() ? (          memo +          participant.ownPresentsCount        ) : (          memo +          participant.ownPresentsCount +          participant.otherPresentsCount        )      )    }, 0)}Events.functions.updatePresentsIsOwnState = function (event) {  //note: only relevant for many-to-one events  Presents.find({eventId: event._id}).forEach((present) => {    Presents.update(present._id, {      $set: {        isOwn: Presents.functions.isOwn({event, present})      }    })  })}Events.functions.updateEventPresentCounts = function (event) {  var eventOwnPresentsCount = Presents.find({    eventId: event._id,    isOwn: true  }).count();  var eventOtherPresentsCount = Presents.find({    eventId: event._id,    isOwn: false  }).count();  Events.update({    _id: event._id  }, {    $set: {      ownPresentsCount: eventOwnPresentsCount,      otherPresentsCount: eventOtherPresentsCount    }  });}/** * METHODS */Events.methods = {}Events.methods.createEvent = new ValidatedMethod({  name: 'Events.methods.createEvent',  mixins: [LoggedIn],  validate: Events.Schemas.Main    .pick(['title', 'type', 'date'])    .validator(),  run(eventData) {    var eventId    if (eventData.type === 'many-to-one') {      eventData.beneficiaryIds = [this.userId]    }    eventId = Events.insert(eventData)    Events.functions.addParticipant({      eventId,      participant: {        userId: this.userId,        status: 'isAccepted'      }    })    return eventId  }})Events.methods.editEvent = new ValidatedMethod({  name: 'Events.methods.editEvent',  mixins: [LoggedIn],  validate: new SimpleSchema([    {      eventId: {        type: String,        regEx: SimpleSchema.RegEx.Id      }    },    Events.Schemas.Main.pick(['title', 'type', 'date'])  ]).validator(),  run({eventId, title, type, date}) {    var updatedCount = Events.update({      _id: eventId,      creatorId: this.userId    }, {      $set: {        title,        type,        date      }    })    Events.functions.updatePresentsIsOwnState(Events.findOne(eventId))    Notifications.functions.createNotification({      type: 'event',      action: 'changed',      eventId,      byUserId: this.userId    })    return updatedCount  }})Events.methods.removeEvent = new ValidatedMethod({  name: 'Events.methods.removeEvent',  mixins: [LoggedIn],  validate: new SimpleSchema({      eventId: {        type: String,        regEx: SimpleSchema.RegEx.Id      }    }).validator(),  run({eventId}) {    var participantIds    //security checks    var {event} = Events.functions      .check({eventId})      .isEventCreator(this.userId)    participantIds = event && event.participants.map(p => p.userId)    Events.remove(eventId)    Presents.functions.removePresents({eventId})    Users.functions.removeTempUsers({_id: {$in: participantIds}})    Notifications.remove({'forEvent.id': eventId})    Notifications.functions.createNotification({      type: 'event',      action: 'removed',      event,      byUserId: this.userId    })  }})Events.methods.addParticipant = new ValidatedMethod({  name: 'Events.methods.addParticipant',  mixins: [LoggedIn],  validate: new SimpleSchema({    eventId: {      type: String    },    sendEmail: {      type: Boolean    },    participant: {      type: Events.Schemas.NewParticipant    }  }).validator(),  run({eventId, participant}) {    if (this.isSimulation) {      //Note: no latency compensation. Add in the future?      return    }    var user = participant.participantId ? Users.findOne(participant.participantId) :      Users.functions.findByEmail(participant.email)    //security checks    Events.functions      .check({eventId})      .isEventCreator(this.userId)      .isNotParticipant(participant.participantId)    //user check    if (user) {      //if user was found, just use his id      participant.userId = user._id      participant.status = 'isInvited'    } else {      //if not, create a new TEMPORARY user      participant.userId = Users.functions.createTemp(participant)      participant.status = 'isTemp'    }    Events.functions.addParticipant({eventId, participant})    Notifications.functions.createNotification({      type: 'event.participant',      action: 'added',      byUserId: this.userId,      forUserId: participant.userId,      eventId    })    if (participant.status === 'isInvited') {      Notifications.functions.createNotification({        type: 'event.invitation',        action: 'added',        byUserId: this.userId,        forUserId: participant.userId,        eventId      })    }    return participant  }})Events.methods.editParticipant = new ValidatedMethod({  name: 'Events.methods.editParticipant',  mixins: [LoggedIn],  validate: new SimpleSchema({    eventId: {      type: String    },    participant: {      type: Events.Schemas.NewParticipant    }  }).validator(),  run({eventId, participant}) {    //security checks    var {event} = Events.functions      .check({eventId})      .isEventCreator(this.userId)      .isParticipant(participant.participantId)    Users.functions.update({      _id: participant.participantId,      isTemp: true    }, participant)    Notifications.functions.createNotification({      type: 'event.participant',      action: 'changed',      byUserId: this.userId,      forUserId: participant.participantId,      event    })  }})Events.methods.removeParticipant = new ValidatedMethod({  name: 'Events.methods.removeParticipant',  mixins: [LoggedIn],  validate: new SimpleSchema({    eventId: {      type: String    },    participantId: {      type: String    }  }).validator(),  run({eventId, participantId}) {    //security checks    var {event} = Events.functions      .check({eventId})      .isEventCreator(this.userId)      .isNotEventCreator(participantId)      .isParticipant(participantId)    Notifications.functions.createNotification({      type: 'event.participant',      action: 'removed',      byUserId: this.userId,      forUserId: participantId,      eventId    })    Events.functions.removeParticipant.call(this, {      eventId,      participantId,      event    })  }})Events.methods.setBeneficiary = new ValidatedMethod({  name: 'Events.methods.setBeneficiary',  mixins: [LoggedIn],  validate: new SimpleSchema({    eventId: SchemaFields.Id,    participantId: SchemaFields.Id,    action: {      type: Boolean    }  }).validator(),  run({eventId, participantId, action}) {    var modificator = action ? '$addToSet' : '$pull'    var updatedCount    var event    //security checks    Events.functions      .check({eventId})      .isEventCreator(this.userId)      .isParticipant(participantId)      .isManyToOne()    updatedCount = Events.update({      _id: eventId,      creatorId: this.userId    }, {      [modificator]: {        beneficiaryIds: participantId      }    })    //note: need to find the event again, because we need    //the data after the update (not before)    event = Events.findOne(eventId)    Events.functions.updatePresentsIsOwnState(event)    Events.functions.updateEventPresentCounts(event)    Notifications.functions.createNotification({      type: 'event.beneficiary',      action: action ? 'added' : 'removed',      byUserId: this.userId,      forUserId: participantId,      event    })    return updatedCount  }})Events.methods.requestJoin = new ValidatedMethod({  name: 'Events.methods.requestJoin',  mixins: [LoggedIn],  validate: new SimpleSchema({    eventId: SchemaFields.Id  }).validator(),  run({eventId}) {    var userId = this.userId    var participant = {      userId,      status: 'requestingJoin'    }    var {event} = Events.functions      .check({eventId})      .isNotParticipant(userId)    Events.functions.addParticipant({eventId, participant})    Notifications.functions.createNotification({      type: 'event.joinRequest',      action: 'added',      byUserId: this.userId,      event    })  }})Events.methods.answerJoinRequest = new ValidatedMethod({  name: 'Events.methods.answerJoinRequest',  mixins: [LoggedIn],  validate: new SimpleSchema({    eventId: SchemaFields.Id,    participantId: SchemaFields.Id,    acceptRequest: {      type: Boolean    }  }).validator(),  run({eventId, participantId, acceptRequest}) {    var {event} = Events.functions      .check({eventId})      .isEventCreator(this.userId)      .isParticipant(participantId)    if (!acceptRequest) {      Events.functions.removeParticipant.call(this, {        eventId,        participantId,        event      })    } else {      Notifications.functions.createNotification({        type: 'event.participant',        action: 'added',        byUserId: this.userId,        forUserId: participantId,        event      })      Events.update({        _id: eventId,        'participants.userId': participantId      }, {        $set: {          'participants.$.status': 'isAccepted'        }      })    }    Notifications.functions.createNotification({      type: 'event.joinRequest',      action: acceptRequest ? 'accepted' : 'rejected',      byUserId: this.userId,      forUserId: participantId,      event    })  }})Events.methods.answerInvitation = new ValidatedMethod({  name: 'Events.methods.answerInvitation',  mixins: [LoggedIn],  validate: new SimpleSchema({    eventId: SchemaFields.Id,    acceptInvitation: {      type: Boolean    }  }).validator(),  run({eventId, acceptInvitation}) {    var {event} = Events.functions      .check({eventId})      .isNotEventCreator(this.userId)      .isParticipant(this.userId)    Notifications.functions.createNotification({      type: 'event.invitation',      action: acceptInvitation ? 'accepted' : 'rejected',      byUserId: this.userId,      event    })    if (!acceptInvitation) {      Events.functions.removeParticipant.call(this, {        eventId,        participantId: this.userId,        event      })    } else {      Events.update({        _id: eventId,        'participants.userId': this.userId      }, {        $set: {          'participants.$.status': 'isAccepted'        }      })    }  }})