import React from 'react'
import {
  getForUser,
  getEventCreator,
  showEvent
} from './commonFunctions'

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
  icon: {main: 'add user'},
  getMessageEl: getMessageEl.bind(eventJoinRequest, 'hasAccepted'),
  show: showEvent
}

eventJoinRequest.rejected = {
  usersFilter: getForUser,
  icon: {main: 'remove user'},
  getMessageEl: getMessageEl.bind(eventJoinRequest, 'hasRejected'),
  show: showEvent
}

eventJoinRequest.added = {
  usersFilter: getEventCreator,
  icon: {main: 'add user'},
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
  show: showEvent
}

export default eventJoinRequest