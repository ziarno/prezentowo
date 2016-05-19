import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getEventBeneficiaries,
  getForUser
} from './userFilters'

var presentBuyer = {}

presentBuyer.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      getForUser(notificationData),
      getEventBeneficiaries(notificationData)
    )
  }
}

presentBuyer.removed = {
  usersFilter: presentBuyer.added.usersFilter
}

export default presentBuyer