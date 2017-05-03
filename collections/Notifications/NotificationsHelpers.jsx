import React from 'react'
import NotificationsMap from './NotificationsMap'

const NotificationsHelpers = {}

NotificationsHelpers.getPicture = function () {
  //note: currently only presents have pictures
  return NotificationsMap.getPicture(this)
}

NotificationsHelpers.getMessageEl = function () {
  return NotificationsMap.getMessageEl(this)
}

NotificationsHelpers.getIcon = function () {
  return NotificationsMap.findField(this).icon
}

NotificationsHelpers.hasPicture = function () {
  return NotificationsMap.findField(this).hasPicture
}

NotificationsHelpers.isShowable = function () {
  return !!NotificationsMap.findField(this).show
}

NotificationsHelpers.show = function () {
  const field = NotificationsMap.findField(this)
  return field && field.show && field.show(this)
}

export default NotificationsHelpers
