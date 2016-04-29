import React from 'react'

Meteor.publishComposite('comments', function({presentId, limit}) {
  return {
    find() {
      return Presents.find(presentId, {
        fields: {
          commentsShared: 1,
          commentsSecret: 1,
          eventId: 1,
          forUserId: 1
        }
      })
    },
    children: [
      {
        find(present) {
          var projection = {
            sort: {
              createdAt: -1
            }
          }
          var event = Events.findOne(present.eventId)
          var isManyToOne = event.type === 'many-to-one'
          var commentIds

          if ((isManyToOne &&
            _.contains(event.beneficiaryIds, this.userId)) ||
            (!isManyToOne &&
            present.forUserId === this.userId)) {
            commentIds = present.commentsShared
          } else {
            commentIds = [
              ...present.commentsShared,
              ...present.commentsSecret
            ]
          }

          if (limit) {
            projection.limit = limit
          }

          return Comments.find({
            _id: {
              $in: commentIds
            }
          }, projection)
        }
      }
    ]
  }
})