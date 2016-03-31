import React from 'react'

Meteor.publish('presents', function ({eventId, forUserId}) {
  if (!this.userId || !eventId) {
    return this.ready()
  }

  var selector

  if (!forUserId) {
    //find all presents for an event
    selector = {
      eventId,
      $or: [
        //find all presents for others
        {
          forUserId: {
            $ne: this.userId
          }
        },
        //for me find only those added by me
        {
          forUserId: this.userId,
          creatorId: this.userId
        }
      ]
    }
  } else if (forUserId === this.userId) {
    //user requesting his own presents - only find those created by him
    selector = {
      eventId,
      forUserId,
      creatorId: forUserId
    }
  } else {
    //user requesting another user's presents - find all presents for that user
    selector = {
      eventId,
      forUserId
    }
  }

  return Presents.find(selector, {
    commentsShared: 0,
    commentsSecret: 0
  })

})