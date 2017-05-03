import React from 'react'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { flattenObject } from '../../lib/utilities'
import { LoggedIn } from '../../lib/Mixins'
import UsersSchemas from './UsersSchemas'

const UsersMethods = {}

UsersMethods.setViewMode = new ValidatedMethod({
  name: 'Users.methods.setViewMode',
  mixins: [LoggedIn],
  validate: UsersSchemas.ViewMode.validator(),
  run(viewMode) {
    return Users.update(this.userId, {
      $set: flattenObject({settings: {viewMode}})
    })
  }
})

UsersMethods.saveUserProfile = new ValidatedMethod({
  name: 'Users.methods.saveUserProfile',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    profile: {
      type: UsersSchemas.Profile
    },
    settings: {
      type: UsersSchemas.Settings
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

export default UsersMethods
