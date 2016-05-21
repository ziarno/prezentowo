import React from 'react'

var UsersFunctions = {}

UsersFunctions.findByEmail = function (email) {
  return email && Users.findOne({
      registered_emails: {
        $elemMatch: {
          address: email
        }
      }
    })
}

UsersFunctions.findByVerifiedEmail = function (email) {
  return email && Users.findOne({
      registered_emails: {
        $elemMatch: {
          address: email,
          verified: true
        }
      }
    })
}

UsersFunctions.createTemp = function ({name, gender, pictureUrl, email}) {
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

UsersFunctions.update = function (selector, {name, gender, pictureUrl, email}) {
  if (email) {
    UsersFunctions.updateEmail(selector, email)
  }

  return Users.update(selector, {
    $set: {
      'profile.name': name,
      'profile.gender': gender,
      'profile.pictureUrl': pictureUrl
    }
  })
}

UsersFunctions.updateEmail = function (selector, email) {
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

UsersFunctions.removeTempUsers = function (selector) {
  var selector = _.extend(selector, {isTemp: true})
  Users.remove(selector)
}

UsersFunctions.getPresentsCount = function (participant) {
  return participant &&
    participant._id === Meteor.userId() ||
    !Meteor.userId() ? (
    parseInt(participant.ownPresentsCount)
  ) : (
    parseInt(participant.ownPresentsCount) +
    parseInt(participant.otherPresentsCount)
  ) || 0
}

UsersFunctions.isBeneficiary = function (event, userId) {
  return event.beneficiaryIds.indexOf(userId) > -1
}

export default UsersFunctions