import React from 'react'
import NotificationsSchemas from './NotificationsSchemas'
import NotificationsFunctions from './NotificationsFunctions'

/**
 * Notifications Collection
 */
Notifications = new Mongo.Collection('notifications')
Notifications
  .permit(['insert', 'update', 'remove'])
  .never()
  .apply() //ongoworks:security

Notifications.Schemas = NotificationsSchemas
Notifications.attachSchema(Notifications.Schemas.Main)

Notifications.functions = NotificationsFunctions