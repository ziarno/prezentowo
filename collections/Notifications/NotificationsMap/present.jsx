import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getEventBeneficiaries,
  getForUser
} from './userFilters'

var present = {}

present.added = {
  usersFilter: function (notificationData) {
    var {event, present} = notificationData
    var isManyToOne = event.type === 'many-to-one'
    var {isOwn} = present

    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      isManyToOne && !isOwn &&
        getEventBeneficiaries(notificationData),
      !isOwn &&
        getForUser(notificationData)
    )
  }
}

present.changed = {
  usersFilter: present.added.usersFilter
}

present.removed = {
  usersFilter: present.added.usersFilter
}

export default present