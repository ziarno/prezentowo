import React from 'react'
import _ from 'underscore'
import {
  getByUser,
  getEventParticipants,
  showEvent
} from './commonFunctions'

const event = {}

function getMessageEl(actionText, notification) {
  const {byUser, forEvent} = notification
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
  getMessageEl: getMessageEl.bind(event, 'hasRemoved'),
  show: showEvent
}

event.changed = {
  usersFilter: event.added.usersFilter,
  icon: {main: 'edit'},
  getMessageEl: getMessageEl.bind(event, 'hasEdited'),
  show: showEvent
}

export default event
