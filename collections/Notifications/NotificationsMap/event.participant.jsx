import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getForUser
} from './userFilters'

var eventParticipant = {}

eventParticipant.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      getForUser(notificationData)
    )
  }
}

eventParticipant.changed = {
  usersFilter: eventParticipant.added.usersFilter
}

eventParticipant.removed = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  }
}

export default eventParticipant