/**
 * Users Collection
 */
Meteor.users.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security

/**
 * HELPER FUNCTIONS
 */
Meteor.users.findByEmail = function (email) {
  return email && Meteor.users.findOne({
      registered_emails: {
        $elemMatch: {
          address: email
        }
      }
    });
};

Meteor.users.findByVerifiedEmail = function (email) {
  return email && Meteor.users.findOne({
      registered_emails: {
        $elemMatch: {
          address: email,
          verified: true
        }
      }
    });
};

/**
 * Collection helpers
 */
Meteor.users.helpers({
  isEventParticipant({eventId, presentId}) {
    var present;

    if (!eventId && presentId) {
      present = Presents.findOne(presentId);
      eventId = present && present.eventId;
    }

    return Events.functions.isUserParticipant({
      eventId,
      participantId: this._id
    });
  },
  hasCreatedPresent(presentId) {
    return !!Presents.findOne({
      _id: presentId,
      creatorId: this._id
    });
  }
});