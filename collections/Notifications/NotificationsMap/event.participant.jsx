import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getForUser,
  showEventForUser,
  showEvent
} from './commonFunctions'

var eventParticipant = {}

eventParticipant.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      getForUser(notificationData)
    )
  },
  icon: {main: 'add user'},
  getMessageEl(notification) {
    var {forUser} = notification
    return (
      <div className="translations text-with-user">
        <User {...forUser} />
        <span>-</span>
        <T>New participant</T>
      </div>
    )
  },
  show: showEventForUser
}

eventParticipant.changed = {
  usersFilter: eventParticipant.added.usersFilter,
  icon: {main: 'user', corner: 'edit'},
  getMessageEl(notification) {
    var {forUser} = notification
    return (
      <div className="translations text-with-user">
        <User {...forUser} />
        <span>-</span>
        <T>Participant edited</T>
      </div>
    )
  },
  show: showEventForUser
}

eventParticipant.removed = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  },
  icon: {main: 'remove user'},
  getMessageEl(notification) {
    var {forUser, forEvent} = notification
    return (
      <div className="translations text-with-user">
        <User {...forUser} />
        <T>{`${forUser.gender}.hasBeen`}</T>
        <T>{`${forUser.gender}.removed`}</T>
        <T>from event</T>
        <span>{forEvent.title}</span>
      </div>
    )
  },
  show: showEvent
}

export default eventParticipant