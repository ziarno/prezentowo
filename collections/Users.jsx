/**
 * Users Collection
 */
Users = Meteor.users
Users.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security

/**
 * HELPER FUNCTIONS
 */
Users.functions = {}

Users.functions.findByEmail = function (email) {
  return email && Users.findOne({
      registered_emails: {
        $elemMatch: {
          address: email
        }
      }
    })
}

Users.functions.findByVerifiedEmail = function (email) {
  return email && Users.findOne({
    registered_emails: {
      $elemMatch: {
        address: email,
        verified: true
      }
    }
  })
}

Users.functions.createTemp = function ({name, gender, pictureUrl, email}) {
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

Users.functions.update = function ({_id, name, gender, pictureUrl, email}) {
  if (email) {
    Users.functions.updateEmail({userId: _id, email})
  }

  return Users.update(_id, {
    $set: {
      'profile.name': name,
      'profile.gender': gender,
      'profile.pictureUrl': pictureUrl
    }
  })
}

Users.functions.updateEmail = function ({userId, email}) {
  var emailObject = {
    address: email,
    verified: false
  }

  Users.update({_id: userId}, {
    $set: {
      emails: [emailObject],
      registered_emails: [emailObject]
    }
  })
}

/**
 * Collection helpers - methods attached to each instance
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