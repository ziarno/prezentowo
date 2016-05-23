import React from 'react'
import NotificationsMap from './NotificationsMap'

var NotificationsHelpers = {}

NotificationsHelpers.getPicture = function () {
  //note: currently only presents have pictures
  return NotificationsMap.getPicture(this)
}

NotificationsHelpers.getMessage = function () {

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

NotificationsHelpers.requiresAction = function () {
  return NotificationsMap.findField(this).requiresAction
}

NotificationsHelpers.getActions = function () {

}

export default NotificationsHelpers