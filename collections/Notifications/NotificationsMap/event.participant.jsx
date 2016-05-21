import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getForUser
} from './userFilters'

var eventParticipant = {}

eventParticipant.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      getForUser(notificationData)
    )
  },
  icon: 'add user',
  getMessageEl(notification) {
    var {forUser} = notification
    return (
      <div className="translations text-with-user">
        <T>New participant</T>
        <span>-</span>
        <User {...forUser} />
      </div>
    )
  }
}

eventParticipant.changed = {
  usersFilter: eventParticipant.added.usersFilter,
  icon: ['user', 'edit'],
  getMessageEl(notification) {
    var {forUser} = notification
    return (
      <div className="translations text-with-user">
        <T>Participant edited</T>
        <span>-</span>
        <User {...forUser} />
      </div>
    )
  }
}

eventParticipant.removed = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  },
  icon: 'remove user',
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
  }
}

export default eventParticipant