/**
 * Users Collection
 */
Users = Meteor.users
Users.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security

/**
 * HELPER FUNCTIONS
 */
Users.findByEmail = function (email) {
  return email && Users.findOne({
      registered_emails: {
        $elemMatch: {
          address: email
        }
      }
    })
}

Users.findByVerifiedEmail = function (email) {
  return email && Users.findOne({
      registered_emails: {
        $elemMatch: {
          address: email,
          verified: true
        }
      }
    })
}

Users.createTemp = function ({name, gender, pictureUrl, email}) {
  var user = {profile: {name, gender, pictureUrl}}

  if (email) {
    user.registered_emails = [{
      address: email,
      verified: false
    }]
  }
  user.isTemp = true
  return Users.insert(user)
}

/**
 * Collection helpers
 */
Users.helpers({
  isEventParticipant({eventId, presentId}) {
    var present

    if (!eventId && presentId) {
      present = Presents.findOne(presentId)
      eventId = present && present.eventId
    }

    return Events.functions.isUserParticipant({
      eventId,
      participantId: this._id
    })
  },
  hasCreatedPresent(presentId) {
    return !!Presents.findOne({
      _id: presentId,
      creatorId: this._id
    })
  }
})