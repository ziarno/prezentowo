import React from 'react'

var NotificationsFunctions = {}

/**
 * Creates a notification.
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
NotificationsFunctions.createNotification = function (data) {
  var {
    type,
    action,
    byUserId,
    forUserId,
    eventId,
    presentId
    } = data
  var seenByUsers
  var notificationData

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
  notificationData = {
    type,
    action,
    seenByUsers,
    byUser: transformUser(data.byUser),
    forUser: transformUser(data.forUser),
    forPresent: getForPresent(),
    forEvent: getForEvent()
  }

  if (type.indexOf('present.comment') !== -1) {
    Notifications.upsert({
      type,
      action,
      'forPresent.id': notificationData.forPresent.id
    }, {
      $set: {
        ...notificationData,
        createdAt: new Date()
      }
    })
  } else {
    Notifications.insert(notificationData)
  }
}

NotificationsFunctions.getUserIdsToSeeNotification = function (data) {
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
        secret: {
          added: function (data) {
            var {event} = data
            var isManyToOne = event.type === 'many-to-one'

            return _.difference(
              getEventParticipants(data),
              getByUser(data),
              isManyToOne &&
              getEventBeneficiaries(data),
              getForUser(data)
            )
          }
        },
        shared: {
          added: function (data) {
            return _.difference(
              getEventParticipants(data),
              getByUser(data)
            )
          }
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

export default NotificationsFunctions