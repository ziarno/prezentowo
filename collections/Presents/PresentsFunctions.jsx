import React from 'react'

const PresentsFunctions = {}

PresentsFunctions.updatePresentsCount = function (incrementValue, presentId) {
  const present = Presents.findOne(presentId)
  const countFieldName = present.isOwn ? 'ownPresentsCount' : 'otherPresentsCount'

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
  const isManyToOneEvent = event && event.type === 'many-to-one'
  if (isManyToOneEvent) {
    //present isOwn if its creator is one of the beneficiaries
    return Users.functions.isBeneficiary(event, creatorId)
  }

  return forUserId === creatorId
}

PresentsFunctions.removePresents = function (selector) {
  const presents = Presents.find(selector, {
    fields: {
      commentsSecret: 1,
      commentsShared: 1
    }
  }).fetch()
  const commentsToRemove = []
  let removedCount

  presents.forEach(present => {
    const {commentsSecret, commentsShared} = present
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
