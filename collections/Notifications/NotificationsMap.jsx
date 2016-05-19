import React from 'react'
import event from './NotificationsMap/event'
import eventParticipant from './NotificationsMap/event.participant'
import eventInvitation from './NotificationsMap/event.invitation'
import eventJoinRequest from './NotificationsMap/event.joinRequest'
import eventBeneficiary from './NotificationsMap/event.beneficiary'
import present from './NotificationsMap/present'
import presentComment from './NotificationsMap/present.comment'
import presentBuyer from './NotificationsMap/present.buyer'

var NotificationsMap = {
  findField: function (notificationData) {
    var {type, action} = notificationData
    return _.reduce(
      [type, action].join('.').split('.'),
      (memo, value) => memo[value],
      NotificationsMap
    )
  },
  usersFilter: function (notificationData) {
    return NotificationsMap
      .findField(notificationData)
      .usersFilter(notificationData)
  }
}

NotificationsMap.event = event
NotificationsMap.event.participant = eventParticipant
NotificationsMap.event.invitation = eventInvitation
NotificationsMap.event.joinRequest = eventJoinRequest
NotificationsMap.event.beneficiary = eventBeneficiary
NotificationsMap.present = present
NotificationsMap.present.comment = presentComment
NotificationsMap.present.buyer = presentBuyer

export default NotificationsMap