import React from 'react'
import {
  getByUser,
  getEventParticipants
} from './userFilters'

var eventBeneficiary = {}

function getMessageEl(actionText, notification) {
  var {forUser} = notification
  return (
    <div className="translations text-with-user">
      <User {...forUser} />
      <T>{`${forUser.gender}.hasBeen`}</T>
      <T>{actionText}</T>
      <T>hints.asBeneficiary</T>
    </div>
  )
}

eventBeneficiary.added = {
  usersFilter(notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  },
  icon: {main: 'add user'},
  getMessageEl: getMessageEl.bind(eventBeneficiary, 'added')
}

eventBeneficiary.removed = {
  usersFilter: eventBeneficiary.added.usersFilter,
  icon: {main: 'remove user'},
  getMessageEl: getMessageEl.bind(eventBeneficiary, 'removed')
}

export default eventBeneficiary