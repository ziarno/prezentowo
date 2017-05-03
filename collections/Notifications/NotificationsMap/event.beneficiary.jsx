import React from 'react'
import _ from 'underscore'
import {
  getByUser,
  getEventParticipants,
  showEvent
} from './commonFunctions'

const eventBeneficiary = {}

function getMessageEl(actionText, notification) {
  const {forUser} = notification
  return (
    <div className="translations text-with-user">
      <User {...forUser} />
      <T>{`${forUser.gender}.hasBeen`}</T>
      <T>{`${forUser.gender}.${actionText}`}</T>
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
  getMessageEl: getMessageEl.bind(eventBeneficiary, 'hasBeenAdded'),
  show: showEvent
}

eventBeneficiary.removed = {
  usersFilter: eventBeneficiary.added.usersFilter,
  icon: {main: 'remove user'},
  getMessageEl: getMessageEl.bind(eventBeneficiary, 'hasBeenRemoved'),
  show: showEvent
}

export default eventBeneficiary
