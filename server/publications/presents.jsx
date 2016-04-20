import React from 'react'

Meteor.publishComposite('presents', function ({eventId, forUserId}) {
  return {
    find: function () {
      return Events.find({
        _id: eventId,
        participants: {
          $elemMatch: {
            userId: this.userId
          }
        }
      })
    },
    children: [
      {
        find: function (event) {
          if (!this.userId || !eventId) {
            return this.ready()
          }

          var selector
          var isManyToOne = event.type === 'many-to-one'
          var isUserBeneficiary =
            _.contains(event.beneficiaryIds, this.userId)

          if (isManyToOne) {
            if (isUserBeneficiary) {
              //user is a beneficiary - show only presents added by beneficiaries
              selector = {
                eventId,
                isOwn: true
              }
            } else {
              //user is not a beneficiary - show all presents
              selector = {eventId}
            }
          } else if (!forUserId) {
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
        }
      }
    ]
  }

})