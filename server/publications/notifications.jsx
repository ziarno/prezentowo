import React from 'react'

Meteor.publish('notifications', function () {
  if (!this.userId) {
    return this.ready()
  }

  return Notifications.find({
    'seenByUsers.id': this.userId
  }, {
    sort: {
      createdAt: 1
    },
    limit: 30
  })
})
