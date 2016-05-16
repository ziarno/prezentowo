import React from 'react'
import {LoggedIn} from '../lib/Mixins'
import {flattenObject} from '../lib/utilities'

/**
 * Users Collection
 */
Users = Meteor.users
Users.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security

Users.defaults = {
  participantsMode: 'single',
  presentMode: 'full-width'
}

/**
 * SCHEMAS
 */
Users.Schemas = {}

Users.Schemas.Email = new SimpleSchema({
  address: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  verified: {
    type: Boolean
  }
})

Users.Schemas.Profile = new SimpleSchema({
  name: SchemaFields.Name,
  pictureUrl: SchemaFields.PictureUrl,
  gender: SchemaFields.Gender
})

Users.Schemas.ViewMode = new SimpleSchema({
  participantsMode: {
    type: String,
    allowedValues: ['single', 'multi'],
    defaultValue: Users.defaults.participantsMode,
    optional: true,
    label: () => _i18n.__('Participants mode')
  },
  presentMode: {
    type: String,
    allowedValues: ['card', 'full-width'],
    defaultValue: Users.defaults.presentMode,
    optional: true,
    label: () => _i18n.__('Present mode')
  }
})

Users.Schemas.Settings = new SimpleSchema({
  viewMode: {
    type: Users.Schemas.ViewMode
  }
})

Users.Schemas.Main = new SimpleSchema({
  registered_emails: {
    type: [Users.Schemas.Email]
  },
  profile: {
    type: Users.Schemas.Profile
  },
  settings: {
    type: Users.Schemas.Settings
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
  return user && user._id === Meteor.userId() ? (
        parseInt(user.ownPresentsCount)
      ) : (
        parseInt(user.ownPresentsCount) +
        parseInt(user.otherPresentsCount)
      ) || 0
}

Users.functions.isBeneficiary = function (event, userId) {
  return event.beneficiaryIds.indexOf(userId) > -1
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

    return Events.functions.participant({
      eventId,
      participantId: this._id
    }).isAccepted()
  },
  hasCreatedPresent(presentId) {
    return !!Presents.findOne({
      _id: presentId,
      creatorId: this._id
    })
  },
  isBeneficiary(event) {
    return Users.functions.isBeneficiary(event, this._id)
  }
})

/**
 * METHODS
 */
Users.methods = {}

Users.methods.setViewMode = new ValidatedMethod({
  name: 'Users.methods.setViewMode',
  mixins: [LoggedIn],
  validate: Users.Schemas.ViewMode.validator(),
  run(viewMode) {
    return Users.update(this.userId, {
      $set: flattenObject({settings: {viewMode}})
    })
  }
})

Users.methods.saveUserProfile = new ValidatedMethod({
  name: 'Users.methods.saveUserProfile',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    profile: {
      type: Users.Schemas.Profile
    },
    settings: {
      type: Users.Schemas.Settings
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validator(),
  run({profile, settings, email}) {
    Users.functions.updateEmail(this.userId, email)
    return Users.update(this.userId, {$set: {
      profile, settings
    }})
  }
})