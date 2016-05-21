import React from 'react'
import event from './NotificationsMap/event'
import eventParticipant from './NotificationsMap/event.participant'
import eventInvitation from './NotificationsMap/event.invitation'
import eventJoinRequest from './NotificationsMap/event.joinRequest'
import eventBeneficiary from './NotificationsMap/event.beneficiary'
import present from './NotificationsMap/present'
import presentComment from './NotificationsMap/present.comment'
import presentBuyer from './NotificationsMap/present.buyer'


/**
 * an object containing information about every type of notification
 * notification objects fields:
 *  - usersFilter(): Function (obligatory) - finds users that
 *    will see the notification
 *  - getMessageEl(): Function (obligatory)
 *  - icon: String || Array - when array, the first icon is main,
 *    second is corner
 *  - requiresAction: Boolean
 *  - hasPicture: Boolean
 *  - getPicture(): Function
 */
var NotificationsMap = {
  findField(notificationData) {
    var {type, action} = notificationData
    return _.reduce(
      [type, action].join('.').split('.'),
      (memo, value) => memo[value],
      NotificationsMap
    )
  },
  //shortcut functions
  usersFilter(notificationData) {
    return NotificationsMap
      .findField(notificationData)
      .usersFilter(notificationData)
  },
  getMessageEl(notification) {
    return NotificationsMap
      .findField(notification)
      .getMessageEl(notification)
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