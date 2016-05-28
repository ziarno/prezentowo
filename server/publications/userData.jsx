import React from 'react'

Meteor.publish('userData', function () {
  if (!this.userId) {
    return void this.ready()
  }
  return Meteor.users.find(this.userId, {fields: {
    registered_emails: 1,
    profile: 1,
    settings: 1
  }})
})