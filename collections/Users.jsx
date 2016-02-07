/**
 * Users Collection
 */
Meteor.users.findByEmail = function (email) {
  return email && Meteor.users.findOne({$or: [
    {'services.facebook.email': email},
    {'emails': {$elemMatch: {address: email}}},
    {'profile.isTemp': true, 'profile.email': email}
  ]});
};

Meteor.users.findByVerifiedEmail = function (email) {
  return email && Meteor.users.findOne({$or: [
    {'services.facebook.email': email},
    {'emails': {$elemMatch: {address: email, verified: true}}}
  ]});
};

/**
 * Collection helpers
 */
Meteor.users.helpers({
  email() {
    return (this.emails && this.emails[0].address) || this.services.facebook.email;
  },
  isEventParticipant({eventId, presentId}) {
    var present;

    if (!eventId && presentId) {
      present = Presents.findOne(presentId);
      eventId = present && present.eventId;
    }

    return !!Events.findOne({
      _id: eventId,
      participants: {
        $elemMatch: {
          userId: this._id
        }
      }
    });
  },
  hasCreatedPresent(presentId) {
    return !!Presents.findOne({
      _id: presentId,
      creatorId: this._id
    });
  }
});