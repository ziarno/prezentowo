import React from 'react'
import {LoggedIn} from '../lib/Mixins'

/**
 * Users Collection
 */
Users = Meteor.users
Users.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security


/**
 * SCHEMAS
 */
Users.schemas = {}

Users.schemas.viewMode = new SimpleSchema({
  participantsMode: {
    type: String,
    allowedValues: ['single-participant', 'all-participants'],
    defaultValue: 'single-participant',
    optional: true
  },
  presentMode: {
    type: String,
    allowedValues: ['card', 'full-width'],
    defaultValue: 'full-width',
    optional: true
  }
})

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
  //TODO: check if each temp user is not a part of another event
  var selector = _.extend(selector, {isTemp: true})
  Users.remove(selector)
}

Users.functions.getPresentsCount = function (user) {
  return parseInt(
      user && user._id === Meteor.userId() ? (
        user.ownPresentsCount
      ) : (
        user.ownPresentsCount + user.otherPresentsCount
      )
    ) || 0
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

/**
 * METHODS
 */
Users.methods = {}

Users.methods.setViewMode = new ValidatedMethod({
  name: 'Users.methods.setViewMode',
  mixins: [LoggedIn],
  validate: Users.schemas.viewMode.validator(),
  run(viewMode) {
    return Users.update(this.userId, {$set: {settings: {viewMode}}})
  }
})