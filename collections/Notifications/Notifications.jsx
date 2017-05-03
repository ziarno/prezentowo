import React from 'react'
import { Mongo } from 'meteor/mongo'
import NotificationsSchemas from './NotificationsSchemas'
import NotificationsFunctions from './NotificationsFunctions'
import NotificationsMethods from './NotificationsMethods'
import NotificationsHelpers from './NotificationsHelpers'
import NotificationsMap from './NotificationsMap'

/**
 * Notifications Collection
 */
Notifications = new Mongo.Collection('notifications')
Notifications
  .permit(['insert', 'update', 'remove'])
  .never()
  .apply() //ongoworks:security

Notifications.Schemas = NotificationsSchemas
Notifications.attachSchema(NotificationsSchemas.Main)
Notifications.functions = NotificationsFunctions
Notifications.methods = NotificationsMethods
Notifications.helpers(NotificationsHelpers)
Notifications.map = NotificationsMap
