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
      createdAt: -1
    }
  });
});

Meteor.publishComposite('eventUsers', function ({eventId}) {
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
      }
    ]
  };
});

Meteor.publishComposite('presents', function ({eventId, forUserId}) {
  if (!this.userId) {
    return this.ready();
  }

  return {
    find: function () {
      return Events.find({
        eventId,
        participants: {
          $elemMatch: {
            userId: this.userId
          }
        }
      });
    },
    children: [
      {
        find: function (event) {
          if (!event) {
            return this.ready();
          }

          return Presents.find({eventId, forUserId});
        },
        children: [
          {
            find: function (present) {
              var commentIds = present.forUserId === this.userId ?
                present.commentsShared :
                [...present.commentsShared, ...present.commentsSecret];

              return Comments.find({
                _id: {
                  $in: commentIds
                }
              }, {
                limit: 10,
                sort: {
                  date: -1
                }
              });
            }
          }
        ]
      }
    ]
  }
});