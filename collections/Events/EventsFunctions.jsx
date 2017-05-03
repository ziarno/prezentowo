import React from 'react'
import _ from 'underscore'
import { _i18n } from 'meteor/universe:i18n'
import { isStatusActive } from '../../lib/constants'

const EventsFunctions = {}

EventsFunctions.addParticipant = function ({eventId, participant}) {
  //clean explicitly, because bug in collection2 for autoValue
  // and defaultValue - this.field('field') doesn't return
  // correct field in sub schemas.
  // Note: use Events.Schemas.Participant (not NewParticipant)
  // so basically convert from NewParticipant to Participant
  Events.Schemas.Participant.clean(participant)

  //in case participant is already on the list (but 'inactive')
  // - just update the existing user
  const updatedCount = Events.update({
    _id: eventId,
    participants: {
      $elemMatch: {
        userId: participant.userId
      }
    }
  }, {
    $set: {
      'participants.$': participant
    }
  })
  const incrementCount = isStatusActive(participant.status) ? 1 : 0
  const modifier = {
    $inc: {
      participantsCount: incrementCount
    }
  }

  if (updatedCount === 0) {
    //participant wasn't on the list already - add new one
    modifier.$push = {
      participants: participant
    }
  }

  Events.update(eventId, modifier)
}

EventsFunctions.removeParticipant = function ({
  eventId,
  participantId,
  event = Events.findOne(eventId)
}) {
  const participant = _.find(
    event.participants,
    p => p.userId === participantId
  )
  const incrementCount = isStatusActive(participant.status) ? -1 : 0
  const modifier = {
    $inc: {
      participantsCount: incrementCount
    },
    $pull: {
      beneficiaryIds: participantId
    }
  }
  const user = Users.findOne(participantId)

  if (user && user.isTemp) {
    modifier.$pull.participants = {
      userId: participantId
    }
    Users.functions.removeTempUsers({
      _id: participantId
    })
  } else {
    modifier.$set = {
      'participants.$.status': 'isRemoved'
    }
  }

  Events.update({
    _id: eventId,
    participants: {
      $elemMatch: {
        userId: participantId
      }
    }
  }, modifier)
  Presents.functions.removePresents({
    forUserId: participantId
  })
  Events.functions.updateEventPresentCounts({event})
}

EventsFunctions.participant = function ({
  eventId,
  participantId,
  event = Events.findOne({
    _id: eventId,
    participants: {
      $elemMatch: {
        userId: participantId
      }
    }
  }, {
    fields: {
      participants: 1
    }
  }),
}) {
  const participant = event && _.find(
    event.participants,
    p => p.userId === participantId
  )

  return {
    isAccepted() {
      return participant &&
        participant.status === 'isAccepted'
    },
    isParticipant() {
      return participant &&
        participant.status &&
        participant.status !== 'isRemoved'
    }
  }

}

EventsFunctions.getAcceptedParticipants = function({
  eventId,
  event = Events.findOne(eventId, {
    fields: {
      participants: 1
    }
  })
}) {
  return _.filter(
    event.participants,
    p => p.status === 'isAccepted'
  )
}

EventsFunctions.check = function ({
  eventId,
  event = Events.findOne(eventId)
}) {

  if (!event) {
    throw new Meteor.Error('eventNotFound',
      _i18n.__('No event', {eventId}))
  }

  function isParticipant(userId) {
    return Events.functions.participant({
      event,
      participantId: userId
    }).isParticipant()
  }

  return {
    event,
    isEventCreator(userId) {
      if (userId !== event.creatorId) {
        throw new Meteor.Error('unauthorized',
          _i18n.__('Not event creator', {eventId}))
      }
      return this
    },
    isNotEventCreator(userId) {
      if (userId === event.creatorId) {
        throw new Meteor.Error(`creatorCannotBeRemoved`,
          _i18n.__('Remove creator'))
      }
      return this
    },
    isNotParticipant(userId) {
      if (isParticipant(userId)) {
        throw new Meteor.Error(`alreadyParticipant`,
          _i18n.__('This user is already a participant', {eventId}))
      }
      return this
    },
    isParticipant(userId) {
      if (!isParticipant(userId)) {
        throw new Meteor.Error(`notParticipant`)
      }
      return this
    },
    isManyToOne() {
      if (event.type !== 'many-to-one') {
        throw new Meteor.Error('Wrong event type',
          'Event is not of type \'many-to-one\'')
      }
      return this
    }
  }
}

EventsFunctions.getPresentsCount = function (event) {
  const isManyToOne = event && event.type === 'many-to-one'

  if (isManyToOne) {
    return Users.functions.isBeneficiary(event, Meteor.userId()) ?
      event.ownPresentsCount :
      (event.ownPresentsCount + event.otherPresentsCount)
  }

  //in the case of 'single' participants mode, we can't just
  //count the presents because only those for a particular
  //user are being published - that's why we must keep
  //track of their count in the event
  return event && event.participants &&
    _.reduce(event.participants, (memo, participant) => {
      return (
        participant.userId === Meteor.userId() || !Meteor.userId() ? (
          memo +
          participant.ownPresentsCount
        ) : (
          memo +
          participant.ownPresentsCount +
          participant.otherPresentsCount
        )
      )
    }, 0)
}

EventsFunctions.updatePresentsIsOwnState = function ({
  eventId,
  event = Events.findOne(eventId)
}) {
  //note: only relevant for many-to-one events
  Presents.find({eventId: event._id}).forEach((present) => {
    Presents.update(present._id, {
      $set: {
        isOwn: Presents.functions.isOwn({event, present})
      }
    })
  })
}

EventsFunctions.updateEventPresentCounts = function ({
  eventId,
  event = Events.findOne(eventId)
}) {
  const presents = Presents.find({
    eventId: event._id
  }).fetch()
  const isManyToMany = event.type === 'many-to-many'

  if (isManyToMany) {
    event.participants.forEach(participant => {
      const [ownPresents, otherPresents] = _.chain(presents)
        .filter(p => p.forUserId === participant.userId)
        .partition(p => p.isOwn)
        .value()

      Events.update({
        _id: event._id,
        participants: {
          $elemMatch: {
            userId: participant.userId
          }
        }
      }, {
        $set: {
          'participants.$.ownPresentsCount': ownPresents.length,
          'participants.$.otherPresentsCount': otherPresents.length
        }
      })
    })
  } else {
    let eventPresentCountsModifier = _.defaults({
      ownPresentsCount: 0,
      otherPresentsCount: 0
    }, _.countBy(presents, p => (
      p.isOwn ? 'ownPresentsCount' : 'otherPresentsCount'
    )))

    Events.update({
      _id: event._id
    }, {
      $set: eventPresentCountsModifier
    })
  }

}

export default EventsFunctions
