import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getForUser
} from './userFilters'

var eventInvitation = {}

eventInvitation.accepted = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  }
}

eventInvitation.rejected = {
  usersFilter: eventInvitation.accepted.usersFilter
}

eventInvitation.added = {
  usersFilter: getForUser
}

export default eventInvitation