import React from 'react'

Meteor.publishComposite('presentDetails', function({
  presentId,
  commentLimit
  }) {
  return {
    //Present
    find() {
      var present = Presents.findOne(presentId)

      if (!present) {
        return void this.ready()
      }

      var {
        eventId,
        forUserId,
        isOwn} = present
      var event = Events.findOne(eventId, {
        fields: {
          type: 1,
          beneficiaries: 1
        }
      })
      var isManyToOne = event.type === 'many-to-one'
      var isUserBeneficiary = isManyToOne &&
        _.contains(event.beneficiaryIds, this.userId)
      var projection = {}

      if (isUserBeneficiary ||
        this.userId === forUserId) {
        projection = {
          fields: {
            buyers: 0
          }
        }
        if (!isOwn) {
          return void this.ready()
        }
      }

      return Presents.find(presentId, projection)
    },
    children: [
      {
        //Comments
        find(present) {
          if (!present) {
            return void this.ready()
          }
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

          if (commentLimit) {
            projection.limit = commentLimit
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