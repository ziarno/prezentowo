import React from 'react'

var PresentsFunctions = {}

PresentsFunctions.updatePresentsCount = function (incrementValue, presentId) {
  var present = Presents.findOne(presentId)
  var countFieldName = present.isOwn ? 'ownPresentsCount' : 'otherPresentsCount'

  if (present.forUserId) {
    Events.update({
      _id: present.eventId,
      'participants.userId': present.forUserId
    }, {$inc: {
      [countFieldName]: incrementValue,
      [`participants.$.${countFieldName}`]: incrementValue
    }})
  } else {
    Events.update({
      _id: present.eventId
    }, {$inc: {
      [countFieldName]: incrementValue
    }})
  }

}

PresentsFunctions.isOwn = function ({
  present,
  event,
  forUserId = present && present.forUserId,
  creatorId = present && present.creatorId
  }) {
  var isManyToOneEvent = event && event.type === 'many-to-one'
  if (isManyToOneEvent) {
    //present isOwn if its creator is one of the beneficiaries
    return Users.functions.isBeneficiary(event, creatorId)
  }

  return forUserId === creatorId
}

PresentsFunctions.removePresents = function (selector) {
  var presents = Presents.find(selector, {
    fields: {
      commentsSecret: 1,
      commentsShared: 1
    }
  }).fetch()
  var commentsToRemove = []
  var removedCount

  presents.forEach(present => {
    var {commentsSecret, commentsShared} = present
    if (commentsSecret) {
      commentsToRemove.concat(commentsSecret)
    }
    if (commentsShared) {
      commentsToRemove.concat(commentsShared)
    }
  })

  removedCount = Presents.remove(selector)

  if (commentsToRemove.length) {
    Comments.remove({
      _id: {
        $in: commentsToRemove
      }
    })
  }

  return removedCount

}

export default PresentsFunctions