import React from 'react'

/**
 * Notifications Collection
 */
Notifications = new Mongo.Collection('notifications')
Notifications.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security

/**
 * SCHEMAS
 */
Notifications.Schemas = {}
Notifications.Schemas.Main = new SimpleSchema({
  type: {
    type: String,
    allowedValues: [
      'event',
      'event.participant',
      'event.invitation',
      'event.joinRequest',
      'event.beneficiary',
      'present',
      'present.comment',
      'present.buyer'
    ]
  },
  action: {
    type: String,
    allowedValues: [
      'added',
      'changed',
      'removed',
      'accepted',
      'rejected'
    ]
  },
  createdAt: SchemaFields.CreatedAt,

  //users to be notified
  seenByUsers: {
    type: [Object]
  },
  'seenByUsers.$.id': SchemaFields.Id,
  'seenByUsers.$.seen': {
    type: Boolean
  },

  //user who initiated the notification
  byUser: {
    type: Object
  },
  'byUser.id': SchemaFields.Id,
  'byUser.name': {
    type: String
  },
  'byUser.picture': {
    type: String
  },
  'byUser.gender': {
    type: String
  },

  //user who the notification is about (ex. present -> for user)
  forUser: {
    type: Object,
    optional: true
  },
  'forUser.id': SchemaFields.Id,
  'forUser.name': {
    type: String
  },
  'forUser.picture': {
    type: String
  },
  'forUser.gender': {
    type: String
  },

  //present that the notification is about
  forPresent: {
    type: Object,
    optional: true
  },
  'forPresent.id': SchemaFields.Id,
  'forPresent.title': {
    type: String
  },
  'forPresent.picture': {
    type: String
  },

  //event that the notification is about
  forEvent: {
    type: Object
  },
  'forEvent.id': SchemaFields.Id,
  'forEvent.title': {
    type: String
  }
})

Notifications.attachSchema(Notifications.Schemas.Main)


/**
 * FUNCTIONS
 */
Notifications.functions = {}

/**
 * Creates notification.
 * Can send data:
 * {
 *   type,
 *   action,
 *   byUser, byUserId,
 *   forUser, forUserId,
 *   event, eventId,
 *   present, presentId
 * }
 */
Notifications.functions.createNotification = function (data) {
  var {
    type,
    action,
    byUserId,
    forUserId,
    eventId,
    presentId
    } = data
  var seenByUsers
  var byUser
  var forUser
  var forPresent
  var forEvent

  function transformUser(user) {
    if (!user || !user.profile) {
      return
    }
    return {
      id: user._id,
      name: user.profile.name,
      picture: user.profile.pictureUrl,
      gender: user.profile.gender
    }
  }

  function getForPresent() {
    var {present} = data
    if (!present) {
      return
    }
    return {
      id: present._id,
      title: present.title,
      picture: present.picture.small
    }
  }

  function getForEvent() {
    var {event} = data
    if (!event) {
      return
    }
    return {
      id: event._id,
      title: event.title
    }
  }

  if (Meteor.isClient) {
    return
  }

  data.present = data.present || Presents.findOne(presentId)
  data.eventId = eventId ||
    !data.event && data.present && data.present.eventId
  data.event = data.event || Events.findOne(data.eventId)
  data.byUser = data.byUser ||
    byUserId && Users.findOne(byUserId, {
      fields: {profile: 1}
    })
  data.forUser = data.forUser ||
    forUserId && Users.findOne(forUserId, {
      fields: {profile: 1}
    })

  seenByUsers =
    _.map(Notifications.functions.getUserIdsToSeeNotification(data),
      userId => ({id: userId, seen: false}))

  if (!seenByUsers.length) {
    return
  }
  byUser = transformUser(data.byUser)
  forUser = transformUser(data.forUser)
  forPresent = getForPresent()
  forEvent = getForEvent()

  Notifications.insert({
    type,
    action,
    seenByUsers,
    byUser,
    forUser,
    forPresent,
    forEvent
  })
}

Notifications.functions.getUserIdsToSeeNotification = function (data) {
  var {type, action} = data
  var filterFunctionsMap = {
    event: {
      added: function (data) {
        return _.difference(
          getEventParticipants(data),
          getByUser(data)
        )
      },
      //changed, removed = added
      participant: {
        added: function (data) {
          return _.difference(
            getEventParticipants(data),
            getByUser(data),
            getForUser(data)
          )
        },
        //changed = added
        removed: function (data) {
          return _.difference(
            getEventParticipants(data),
            getByUser(data)
          )
        }
      },
      invitation: {
        accepted: function (data) {
          return _.difference(
            getEventParticipants(data),
            getByUser(data)
          )
        },
        //rejected = accepted
        added: getForUser
      },
      joinRequest: {
        accepted: getForUser,
        rejected: getForUser,
        added: getEventCreator
      },
      beneficiary: {
        added: function (data) {
          return _.difference(
            getEventParticipants(data),
            getByUser(data)
          )
        }
        //removed = added
      }
    },

    present: {
      added: function (data) {
        var {event, present} = data
        var isManyToOne = event.type === 'many-to-one'
        var isOwn = present.isOwn

        return _.difference(
          getEventParticipants(data),
          getByUser(data),
          isManyToOne && !isOwn &&
            getEventBeneficiaries(data),
          !isOwn &&
            getForUser(data)
        )
      },
      //changed, removed = added
      comment: {
        added: function (data) {
          var {event, commentType} = data
          var isManyToOne = event.type === 'many-to-one'
          var isCommentSecret = commentType === 'secret'

          return _.difference(
            getEventParticipants(data),
            getByUser(data),
            isManyToOne && isCommentSecret &&
              getEventBeneficiaries(data),
            isCommentSecret &&
              getForUser(data)
          )
        }
      },
      buyer: {
        added: function (data) {
          return _.difference(
            getEventParticipants(data),
            getByUser(data),
            getForUser(data),
            getEventBeneficiaries(data)
          )
        }
        //removed = added
      }
    }
  }

  filterFunctionsMap.event.changed =
    filterFunctionsMap.event.removed =
      filterFunctionsMap.event.added
  filterFunctionsMap.event.participant.changed =
    filterFunctionsMap.event.participant.added
  filterFunctionsMap.event.invitation.rejected =
    filterFunctionsMap.event.invitation.accepted
  filterFunctionsMap.event.beneficiary.removed =
    filterFunctionsMap.event.beneficiary.added
  filterFunctionsMap.present.changed =
    filterFunctionsMap.present.removed =
      filterFunctionsMap.present.added
  filterFunctionsMap.present.buyer.removed =
    filterFunctionsMap.present.buyer.added

  function getByUser({byUser}) {
    return [byUser._id]
  }

  function getEventParticipants({event}) {
    var acceptedParticipants =
      Events.functions.getAcceptedParticipants({event})
    return _.map(acceptedParticipants, p => p.userId)
  }

  function getEventBeneficiaries({event}) {
    return event.beneficiaryIds
  }

  function getForUser({forUser}) {
    return forUser && [forUser._id]
  }

  function getEventCreator({event}) {
    return [event.creatorId]
  }

  return _.reduce(
    [type, action].join('.').split('.'),
    (memo, value) => memo[value],
    filterFunctionsMap
  )(data)
}