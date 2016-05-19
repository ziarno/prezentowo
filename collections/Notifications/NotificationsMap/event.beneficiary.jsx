import React from 'react'
import {
  getByUser,
  getEventParticipants
} from './userFilters'

var eventBeneficiary = {}

eventBeneficiary.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  }
}

eventBeneficiary.removed = {
  usersFilter: eventBeneficiary.added.usersFilter
}

export default eventBeneficiary