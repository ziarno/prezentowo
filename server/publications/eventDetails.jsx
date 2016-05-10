import React from 'react'

Meteor.publishComposite('eventDetails', function ({eventId}) {
  return {
    find() {
      return Events.find({
        _id: eventId
      })
    },
    children: [
      {
        //tempUsers - publish emails
        collectionName: 'participants',
        find(event) {
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
        find(event) {
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