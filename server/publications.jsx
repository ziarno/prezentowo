/**
 * Events
 */
Meteor.publish('events', function () {
  if (!this.userId) {
    return this.ready();
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
  });
});

Meteor.publishComposite('eventDetails', function ({eventId}) {
  //Meteor._sleepForMs(2000);
  return {
    find: function () {
      return Events.find({
        _id: eventId,
        participants: {
          $elemMatch: {
            userId: this.userId
          }
        }
      });
    },
    children: [
      {
        collectionName: 'participants',
        find: function (event) {
          var participantIds = event.participants
            .map(participant => participant.userId);

          return Meteor.users.find({
            _id: {
              $in: participantIds
            }
          }, {
            fields: {
              profile: 1,
              isTemp: 1
            }
          });
        }
      },
      {
        find: function (event) {
          if (!event) {
            return this.ready();
          }

          return Presents.find({
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
          }, {
            commentsShared: 0,
            commentsSecret: 0
          });
        }
      }
    ]
  };
});

Meteor.publish('comments', function ({presentId, limit = 10}) {
  var present = Presents.find(presentId);
  var commentIds = present.forUserId === this.userId ?
    present.commentsShared :
    [...present.commentsShared, ...present.commentsSecret];

  return Comments.find({
    _id: {
      $in: commentIds
    }
  }, {
    limit: limit,
    sort: {
      date: -1
    }
  });
});