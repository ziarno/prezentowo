import React from 'react'
import present from './present'
import {
  getByUser,
  getEventParticipants,
  getEventBeneficiaries,
  getForUser
} from './userFilters'

var presentBuyer = {}

function getMessageEl(willBuy, notification) {
  var {byUser, forPresent} = notification
  return (
    <div className="translations text-with-user">
      <User {...byUser} />
      {willBuy ? <T>will buy</T> : <T>will not buy</T>}
      <span>{forPresent.title}</span>
    </div>
  )
}

presentBuyer.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      getForUser(notificationData),
      getEventBeneficiaries(notificationData)
    )
  },
  icon: ['dollar', 'plus'],
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl: getMessageEl.bind(presentBuyer, true)
}

presentBuyer.removed = {
  usersFilter: presentBuyer.added.usersFilter,
  icon: ['dollar', 'minus'],
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl: getMessageEl.bind(presentBuyer, false)
}

export default presentBuyer