import React from 'react'

function getFieldsProjection({buyers}) {
  var projection = {
    fields: {
      commentsShared: 0,
      commentsSecret: 0,
    }
  }

  if (!buyers) {
    projection.fields.buyers = 0
  }

  return projection
}

Meteor.publishComposite('presents', function ({eventId, forUserId}) {
  return {
    find() {
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
        find(event) {
          if (!this.userId || !eventId) {
            return this.ready()
          }

          var isManyToOne = event.type === 'many-to-one'
          var isUserBeneficiary =
            _.contains(event.beneficiaryIds, this.userId)

          //many-to-one
          if (isManyToOne) {
            if (isUserBeneficiary) {
              //user is a beneficiary -
              //show only presents added by beneficiaries
              return Presents.find(
                {eventId, isOwn: true},
                getFieldsProjection({buyers: 0})
              )
            }
            return Presents.find(
              {eventId},
              getFieldsProjection({buyers: 1})
            )
          }

          //many-to-many
          if (forUserId === this.userId) {
            //user requesting his own presents -
            //only find those created by him
            return Presents.find({
              eventId,
              forUserId,
              creatorId: forUserId
            }, getFieldsProjection({buyers: 0}))
          }

          if (forUserId && forUserId !== this.userId) {
            //user requesting another user's presents -
            //find all presents for that user
            return Presents.find({
              eventId,
              forUserId
            }, getFieldsProjection({buyers: 1}))
          }

          return this.ready()

        }
      },
      //note: we cannot return an array of cursors
      //(reywood:publish-composite restriction)
      //we must split this situation into 2 find()
      //functions:
      {
        find(event) {
          var isManyToMany = event.type === 'many-to-many'

          if (isManyToMany && !forUserId) {
            //find all presents for others
            return Presents.find({
              eventId,
              forUserId: {
                $ne: this.userId
              }
            }, getFieldsProjection({buyers: 1}))
          }

          return this.ready()
        }
      },
      {
        find(event) {
          var isManyToMany = event.type === 'many-to-many'

          if (isManyToMany && !forUserId) {
            //for me find only those created by me
            return Presents.find({
              eventId,
              forUserId: this.userId,
              creatorId: this.userId
            }, getFieldsProjection({buyers: 0}))
          }

          return this.ready()
        }
      }
    ]
  }

})