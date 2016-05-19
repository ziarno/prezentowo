import React from 'react'

var NotificationsSchemas = {}
NotificationsSchemas.Main = new SimpleSchema({
  type: {
    type: String,
    allowedValues: [
      'event',
      'event.participant',
      'event.invitation',
      'event.joinRequest',
      'event.beneficiary',
      'present',
      'present.comment.secret',
      'present.comment.shared',
      'present.buyer'
    ]
  },
  action: {
    type: String,
    allowedValues: [
      'added',
      'changed',
      'removed',
      'accepted',
      'rejected'
    ]
  },
  createdAt: SchemaFields.CreatedAt,

  //users to be notified
  seenByUsers: {
    type: [Object]
  },
  'seenByUsers.$.id': SchemaFields.Id,
  'seenByUsers.$.seen': {
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
  'byUser.gender': {
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
  'forUser.gender': {
    type: String
  },

  //present that the notification is about
  forPresent: {
    type: Object,
    optional: true
  },
  'forPresent.id': SchemaFields.Id,
  'forPresent.title': {
    type: String
  },
  'forPresent.picture': {
    type: String
  },

  //event that the notification is about
  forEvent: {
    type: Object
  },
  'forEvent.id': SchemaFields.Id,
  'forEvent.title': {
    type: String
  }
})

export default NotificationsSchemas