import React from 'react'

Meteor.publishComposite('participants', function ({eventId}) {
  //Meteor._sleepForMs(2000)
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
        //tempUsers - publish emails
        collectionName: 'participants',
        find: function (event) {
          var participantIds = event.participants
            .map(participant => participant.userId)

          return Meteor.users.find({
            _id: {
              $in: participantIds
            },
            isTemp: true
          }, {
            fields: {
              profile: 1,
              isTemp: 1,
              registered_emails: 1
            }
          })
        }
      },
      {
        //registeredUsers - don't publish emails
        collectionName: 'participants',
        find: function (event) {
          var participantIds = event.participants
            .map(participant => participant.userId)

          return Meteor.users.find({
            _id: {
              $in: participantIds
            },
            $or: [
              {isTemp: {$exists: false}},
              {isTemp: {$ne: true}}
            ]
          }, {
            fields: {
              profile: 1,
              isTemp: 1
            }
          })
        }
      }
    ]
  }
})