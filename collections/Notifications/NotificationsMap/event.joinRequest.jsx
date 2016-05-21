import React from 'react'
import {
  getForUser,
  getEventCreator
} from './userFilters'

var eventJoinRequest = {}

function getMessageEl(actionText, notification) {
  var {byUser, forEvent} = notification
  return (
    <div className="translations text-with-user">
      <User {...byUser} />
      <T>{`${byUser.gender}.${actionText}`}</T>
      <T>your request to join event</T>
      <span>{forEvent.title}</span>
    </div>
  )
}

eventJoinRequest.accepted = {
  usersFilter: getForUser,
  icon: 'add user',
  getMessageEl: getMessageEl.bind(eventJoinRequest, 'hasAccepted')
}

eventJoinRequest.rejected = {
  usersFilter: getForUser,
  icon: 'remove user',
  getMessageEl: getMessageEl.bind(eventJoinRequest, 'hasRejected')
}

eventJoinRequest.added = {
  usersFilter: getEventCreator,
  icon: 'add user',
  getMessageEl(notification) {
    var {byUser, forEvent} = notification
    return (
      <div className="translations text-with-user">
        <User {...byUser} />
        <T>is requesting to join event</T>
        <span>{forEvent.title}</span>
      </div>
    )
  },
  requiresAction: true
}

export default eventJoinRequest