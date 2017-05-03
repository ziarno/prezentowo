import React from 'react'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { LoggedIn } from '../../lib/Mixins'
import EventsSchemas from './EventsSchemas'

const EventsMethods = {}

EventsMethods.createEvent = new ValidatedMethod({
  name: 'Events.methods.createEvent',
  mixins: [LoggedIn],
  validate: EventsSchemas.Main
    .pick(['title', 'type', 'date'])
    .validator(),
  run(eventData) {
    let eventId

    if (eventData.type === 'many-to-one') {
      eventData.beneficiaryIds = [this.userId]
    }
    eventId = Events.insert(eventData)
    Events.functions.addParticipant({
      eventId,
      participant: {
        userId: this.userId,
        status: 'isAccepted'
      }
    })

    return eventId
  }
})

EventsMethods.editEvent = new ValidatedMethod({
  name: 'Events.methods.editEvent',
  mixins: [LoggedIn],
  validate: new SimpleSchema([
    {
      eventId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    },
    EventsSchemas.Main.pick(['title', 'type', 'date'])
  ]).validator(),
  run({eventId, title, type, date}) {
    const updatedCount = Events.update({
      _id: eventId,
      creatorId: this.userId
    }, {
      $set: {
        title,
        type,
        date
      }
    })

    Events.functions.updatePresentsIsOwnState({eventId})

    Notifications.functions.createNotification({
      type: 'event',
      action: 'changed',
      eventId,
      byUserId: this.userId
    })

    return updatedCount
  }
})

EventsMethods.removeEvent = new ValidatedMethod({
  name: 'Events.methods.removeEvent',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({eventId}) {
    let participantIds

    //security checks
    const {event} = Events.functions
      .check({eventId})
      .isEventCreator(this.userId)

    participantIds = event && event.participants.map(p => p.userId)

    Events.remove(eventId)
    Presents.functions.removePresents({eventId})
    Users.functions.removeTempUsers({_id: {$in: participantIds}})
    Notifications.remove({'forEvent.id': eventId})

    Notifications.functions.createNotification({
      type: 'event',
      action: 'removed',
      event,
      byUserId: this.userId
    })

  }
})

EventsMethods.addParticipant = new ValidatedMethod({
  name: 'Events.methods.addParticipant',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: {
      type: String
    },
    sendEmail: {
      type: Boolean
    },
    participant: {
      type: EventsSchemas.NewParticipant
    }
  }).validator(),
  run({eventId, participant}) {
    if (this.isSimulation) {
      //Note: no latency compensation. Add in the future?
      return
    }

    const user = participant.participantId ? Users.findOne(participant.participantId) :
      Users.functions.findByEmail(participant.email)

    //security checks
    Events.functions
      .check({eventId})
      .isEventCreator(this.userId)
      .isNotParticipant(participant.participantId)

    //user check
    if (user) {
      //if user was found, just use his id
      participant.userId = user._id
      participant.status = 'isInvited'
    } else {
      //if not, create a new TEMPORARY user
      participant.userId = Users.functions.createTemp(participant)
      participant.status = 'isTemp'
    }

    Events.functions.addParticipant({eventId, participant})
    Notifications.functions.createNotification({
      type: 'event.participant',
      action: 'added',
      byUserId: this.userId,
      forUserId: participant.userId,
      eventId
    })

    if (participant.status === 'isInvited') {
      Notifications.functions.createNotification({
        type: 'event.invitation',
        action: 'added',
        byUserId: this.userId,
        forUserId: participant.userId,
        eventId
      })
    }

    return participant
  }
})

EventsMethods.editParticipant = new ValidatedMethod({
  name: 'Events.methods.editParticipant',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: {
      type: String
    },
    participant: {
      type: EventsSchemas.NewParticipant
    }
  }).validator(),
  run({eventId, participant}) {
    //security checks
    const {event} = Events.functions
      .check({eventId})
      .isEventCreator(this.userId)
      .isParticipant(participant.participantId)

    Users.functions.update({
      _id: participant.participantId,
      isTemp: true
    }, participant)

    Notifications.functions.createNotification({
      type: 'event.participant',
      action: 'changed',
      byUserId: this.userId,
      forUserId: participant.participantId,
      event
    })
  }
})

EventsMethods.removeParticipant = new ValidatedMethod({
  name: 'Events.methods.removeParticipant',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: {
      type: String
    },
    participantId: {
      type: String
    }
  }).validator(),
  run({eventId, participantId}) {
    //security checks
    const {event} = Events.functions
      .check({eventId})
      .isEventCreator(this.userId)
      .isNotEventCreator(participantId)
      .isParticipant(participantId)

    Notifications.functions.createNotification({
      type: 'event.participant',
      action: 'removed',
      byUserId: this.userId,
      forUserId: participantId,
      eventId
    })

    Events.functions.removeParticipant.call(this, {
      eventId,
      participantId,
      event
    })

  }
})

EventsMethods.setBeneficiary = new ValidatedMethod({
  name: 'Events.methods.setBeneficiary',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: SchemaFields.Id,
    participantId: SchemaFields.Id,
    action: {
      type: Boolean
    }
  }).validator(),
  run({eventId, participantId, action}) {
    const modificator = action ? '$addToSet' : '$pull'

    //security checks
    Events.functions
      .check({eventId})
      .isEventCreator(this.userId)
      .isParticipant(participantId)
      .isManyToOne()

    const updatedCount = Events.update({
      _id: eventId,
      creatorId: this.userId
    }, {
      [modificator]: {
        beneficiaryIds: participantId
      }
    })

    //note: need to find the event again, because we need
    //the data after the update (not before)
    const event = Events.findOne(eventId)
    Events.functions.updatePresentsIsOwnState({event})
    Events.functions.updateEventPresentCounts({event})

    Notifications.functions.createNotification({
      type: 'event.beneficiary',
      action: action ? 'added' : 'removed',
      byUserId: this.userId,
      forUserId: participantId,
      event
    })

    return updatedCount
  }
})

EventsMethods.requestJoin = new ValidatedMethod({
  name: 'Events.methods.requestJoin',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: SchemaFields.Id
  }).validator(),
  run({eventId}) {
    const userId = this.userId
    const participant = {
      userId,
      status: 'requestingJoin'
    }
    const {event} = Events.functions
      .check({eventId})
      .isNotParticipant(userId)

    Events.functions.addParticipant({eventId, participant})

    Notifications.functions.createNotification({
      type: 'event.joinRequest',
      action: 'added',
      byUserId: this.userId,
      event
    })

  }
})

EventsMethods.answerJoinRequest = new ValidatedMethod({
  name: 'Events.methods.answerJoinRequest',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: SchemaFields.Id,
    participantId: SchemaFields.Id,
    acceptRequest: {
      type: Boolean
    },
    mergeWithUserId: {
      ...SchemaFields.Id,
      optional: true
    }
  }).validator(),
  run({eventId, participantId, acceptRequest, mergeWithUserId}) {
    const {event} = Events.functions
      .check({eventId})
      .isEventCreator(this.userId)
      .isParticipant(participantId)
    const participant = _.find(event.participants,
      p => p.userId === participantId)

    if (!acceptRequest) {
      Events.functions.removeParticipant.call(this, {
        eventId,
        participantId,
        event
      })
    } else {
      Notifications.functions.createNotification({
        type: 'event.participant',
        action: 'added',
        byUserId: this.userId,
        forUserId: participantId,
        event
      })
      participant.status = 'isAccepted'
      Events.functions.addParticipant({eventId, participant})

      if (mergeWithUserId && !this.isSimulation) {
        Users.functions.mergeUsers({
          userIdToBeRemoved: mergeWithUserId,
          userIdToStay: participantId,
          eventId
        })
        Events.functions.updateEventPresentCounts({event})
      }

    }

    Notifications.functions.createNotification({
      type: 'event.joinRequest',
      action: acceptRequest ? 'accepted' : 'rejected',
      byUserId: this.userId,
      forUserId: participantId,
      event
    })

  }
})

EventsMethods.answerInvitation = new ValidatedMethod({
  name: 'Events.methods.answerInvitation',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    eventId: SchemaFields.Id,
    acceptInvitation: {
      type: Boolean
    }
  }).validator(),
  run({eventId, acceptInvitation}) {
    const {event} = Events.functions
      .check({eventId})
      .isNotEventCreator(this.userId)
      .isParticipant(this.userId)

    Notifications.functions.createNotification({
      type: 'event.invitation',
      action: acceptInvitation ? 'accepted' : 'rejected',
      byUserId: this.userId,
      event
    })

    if (!acceptInvitation) {
      Events.functions.removeParticipant.call(this, {
        eventId,
        participantId: this.userId,
        event
      })
    } else {
      Events.update({
        _id: eventId,
        'participants.userId': this.userId
      }, {
        $set: {
          'participants.$.status': 'isAccepted'
        }
      })
    }

  }
})

export default EventsMethods
