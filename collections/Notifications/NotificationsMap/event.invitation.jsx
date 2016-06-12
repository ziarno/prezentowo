import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getForUser,
  showEvent,
  showEventByUser
} from './commonFunctions'

var eventInvitation = {}

function getMessageEl(actionText, notification) {
  var {byUser, forEvent} = notification
  return (
    <div className="translations text-with-user">
      <User {...byUser} />
      <T>{`${byUser.gender}.${actionText}`}</T>
      <T>invitation to event</T>
      <span>{forEvent.title}</span>
    </div>
  )
}

eventInvitation.accepted = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  },
  icon: {main: 'mail outline', corner: 'checkmark'},
  getMessageEl: getMessageEl.bind(eventInvitation, 'hasAccepted'),
  show: showEventByUser
}

eventInvitation.rejected = {
  usersFilter: eventInvitation.accepted.usersFilter,
  icon: {main: 'mail outline', corner: 'remove'},
  getMessageEl: getMessageEl.bind(eventInvitation, 'hasRejected'),
  show: showEvent
}

eventInvitation.added = {
  usersFilter: getForUser,
  icon: {main: 'mail outline'},
  getMessageEl(notification) {
    var {byUser, forEvent} = notification
    return (
      <div className="translations text-with-user">
        <User {...byUser} />
        <T>is inviting you to the event</T>
        <span>{forEvent.title}</span>
      </div>
    )
  },
  show: showEvent
}

export default eventInvitation