import React from 'react'
import {
  getByUser,
  getEventParticipants,
} from './userFilters'

var event = {}

event.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  }
}

event.removed = {
  usersFilter: event.added.usersFilter
}

event.changed = {
  usersFilter: event.added.usersFilter
}

export default event