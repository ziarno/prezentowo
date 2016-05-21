import React from 'react'
import {
  getByUser,
  getEventParticipants,
} from './userFilters'

var event = {}

function getMessageEl(actionText, notification) {
  var {byUser, forEvent} = notification
  return (
    <div className="translations text-with-user">
      <T>Event</T>
      <span>{forEvent.title}</span>
      <T>{actionText}</T>
      <User {...byUser} />
    </div>
  )
}

//even though nobody will ever see the 'event.added' notification
//(because there is only 1 participant - the creator)
//we need to have all the possible type.action combinations
event.added = {
  usersFilter(notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  },
  icon: 'plus',
  getMessageEl() {
    return ''
  }
}

event.removed = {
  usersFilter: event.added.usersFilter,
  icon: 'remove',
  getMessageEl: getMessageEl.bind(event,
    'hints.event.removed')
}

event.changed = {
  usersFilter: event.added.usersFilter,
  icon: 'edit',
  getMessageEl: getMessageEl.bind(event,
    'hints.event.edited')
}

export default event