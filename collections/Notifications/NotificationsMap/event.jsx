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
      <User {...byUser} />
      <T>{`${byUser.gender}.${actionText}`}</T>
      <T>event</T>
      <span>{forEvent.title}</span>
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
  icon: {main: 'plus'},
  getMessageEl() {
    return ''
  }
}

event.removed = {
  usersFilter: event.added.usersFilter,
  icon: {main: 'remove'},
  getMessageEl: getMessageEl.bind(event,
    'hasRemoved')
}

event.changed = {
  usersFilter: event.added.usersFilter,
  icon: {main: 'edit'},
  getMessageEl: getMessageEl.bind(event,
    'hasEdited')
}

export default event