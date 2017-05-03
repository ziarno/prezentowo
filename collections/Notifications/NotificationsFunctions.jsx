import React from 'react'
import _ from 'underscore'
import NotificationsMap from './NotificationsMap'

const NotificationsFunctions = {}

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

function getForPresent({present}) {
  if (!present) {
    return
  }
  return {
    id: present._id,
    title: present.title,
    picture: present.picture.small
  }
}

function getForEvent({event}) {
  if (!event) {
    return
  }
  return {
    id: event._id,
    title: event.title
  }
}

/**
 * Creates a notification.
 * data param:
 * {
 *   type,
 *   action,
 *   byUser, byUserId,
 *   forUser, forUserId,
 *   event, eventId,
 *   present, presentId
 * }
 */
NotificationsFunctions.createNotification = function (notificationData) {
  const {
    type,
    action,
    byUserId,
    forUserId,
    eventId,
    presentId
    } = notificationData
  let seenByUsers
  let notification

  if (Meteor.isClient) {
    return
  }

  notificationData.present = notificationData.present ||
    Presents.findOne(presentId)
  notificationData.eventId = eventId ||
    !notificationData.event &&
    notificationData.present &&
    notificationData.present.eventId
  notificationData.event = notificationData.event ||
    Events.findOne(notificationData.eventId)
  notificationData.byUser = notificationData.byUser ||
    byUserId && Users.findOne(byUserId, {
      fields: {profile: 1}
    })
  notificationData.forUser = notificationData.forUser ||
    forUserId && Users.findOne(forUserId, {
      fields: {profile: 1}
    })

  seenByUsers =
    _.map(NotificationsMap.usersFilter(notificationData),
      userId => ({id: userId, seen: false}))

  if (!seenByUsers.length) {
    return
  }
  notification = {
    type,
    action,
    createdAt: new Date(),
    seenByUsers,
    byUser: transformUser(notificationData.byUser),
    forUser: transformUser(notificationData.forUser),
    forPresent: getForPresent(notificationData),
    forEvent: getForEvent(notificationData)
  }

  if (type.indexOf('present.comment') !== -1) {
    //comments notifications per present get updated
    // - there would be too many of them otherwise
    Notifications.upsert({
      type,
      action,
      'forPresent.id': notification.forPresent.id
    }, {
      $set: notification
    })
  } else {
    Notifications.insert(notification)
  }
}

NotificationsFunctions.getUnseenCount = function () {
  return Notifications.find({
    seenByUsers: {
      $elemMatch: {
        id: Meteor.userId(),
        seen: false
      }
    }
  }).count()
}

export default NotificationsFunctions
