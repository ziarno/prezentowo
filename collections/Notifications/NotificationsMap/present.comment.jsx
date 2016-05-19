import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getEventBeneficiaries,
  getForUser
} from './userFilters'

var presentComment = {
  secret: {},
  shared: {}
}

presentComment.secret.added = {
  usersFilter: function (notificationData) {
    var {event} = notificationData
    var isManyToOne = event.type === 'many-to-one'

    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      isManyToOne &&
        getEventBeneficiaries(notificationData),
      getForUser(notificationData)
    )
  }
}

presentComment.shared.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  }
}


export default presentComment