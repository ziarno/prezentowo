import React from 'react'

/**
 * Notifications Collection
 */
Notifications = new Mongo.Collection('notifications')
Notifications.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security

/**
 * SCHEMAS
 */
Notifications.Schemas = {}
Notifications.Schemas.Main = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['comment', 'event', 'present']
  },
  action: {
    type: String,
    allowedValues: ['new', 'changed', 'edited']
  },
  createdAt: SchemaFields.CreatedAt,

  //users to be notified
  seenByUsers: {
    type: [Object]
  },
  'seenByUsers.id': SchemaFields.Id,
  'seenByUsers.seen': {
    type: Boolean
  },

  //user who initiated the notification
  byUser: {
    type: Object
  },
  'byUser.id': SchemaFields.Id,
  'byUser.name': {
    type: String
  },
  'byUser.picture': {
    type: String
  },

  //user who the notification is about (ex. present -> for user)
  forUser: {
    type: Object,
    optional: true
  },
  'forUser.id': SchemaFields.Id,
  'forUser.name': {
    type: String
  },
  'forUser.picture': {
    type: String
  },

  //present that the notification is about
  forPresent: {
    type: Object,
    optional: true
  },
  'forPresent.id': SchemaFields.Id,
  'forPresent.name': {
    type: String
  },
  'forPresent.picture': {
    type: String
  },

  //event that the notification is about
  forEvent: {
    type: Object,
    optional: true
  },
  'forEvent.id': SchemaFields.Id,
  'forEvent.name': {
    type: String
  }
})

Notifications.attachSchema(Notifications.Schemas.Main)