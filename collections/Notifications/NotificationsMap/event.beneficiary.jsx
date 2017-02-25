import React from 'react'
import {
  getByUser,
  getEventParticipants,
  showEvent
} from './commonFunctions'

var eventBeneficiary = {}

function getMessageEl(actionText, notification) {
  var {forUser} = notification
  return (
    <div className="translations text-with-user">
      <User {...forUser} />
      <T>{`${forUser.gender}.hasBeen`}</T>
      <T>{`${forUser.gender}.${actionText}`}</T>
      <T>hints.asBeneficiary</T>
    </div>
  )
}

function getMessage(actionText, notification, lang = Language.get()) {
  var {forUser} = notification
  var t = _i18n.createTranslator('', lang)
  var parts = [
    t(`${forUser.gender}.hasBeen`),
    t(`${forUser.gender}.${actionText}`),
    t(hints.asBeneficiary)
  ]
  return parts.join(' ')
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