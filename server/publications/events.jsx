import React from 'react'

Meteor.publish('events', function () {
  if (!this.userId) {
    return void this.ready()
  }

  return Events.find({
    participants: {
      $elemMatch: {
        userId: this.userId
      }
    }
  }, {
    sort: {
      date: -1
    }
  })
})
