import React from 'react'

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

Users.functions.update = function (selector, {name, gender, pictureUrl, email}) {
  if (email) {
    Users.functions.updateEmail(selector, email)
  }

  return Users.update(selector, {
    $set: {
      'profile.name': name,
      'profile.gender': gender,
      'profile.pictureUrl': pictureUrl
    }
  })
}

Users.functions.updateEmail = function (selector, email) {
  var emailObject = {
    address: email,
    verified: false
  }

  Users.update(selector, {
    $set: {
      emails: [emailObject],
      registered_emails: [emailObject]
    }
  })
}

Users.functions.removeTempUsers = function (selector) {
  //TODO: check if each temp user is not a part of another event!
  var selector = _.extend(selector, {isTemp: true})
  Users.remove(selector)
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