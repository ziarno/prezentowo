import React from 'react'
import UsersDefaults from './UsersDefaults'

var UsersSchemas = {}

UsersSchemas.Email = new SimpleSchema({
  address: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  verified: {
    type: Boolean
  }
})

UsersSchemas.Profile = new SimpleSchema({
  name: SchemaFields.Name,
  pictureUrl: SchemaFields.PictureUrl,
  gender: SchemaFields.Gender
})

UsersSchemas.ViewMode = new SimpleSchema({
  participantsMode: {
    type: String,
    allowedValues: ['single', 'multi'],
    defaultValue: UsersDefaults.participantsMode,
    optional: true,
    label: () => _i18n.__('Participants mode')
  },
  presentMode: {
    type: String,
    allowedValues: ['card', 'full-width'],
    defaultValue: UsersDefaults.presentMode,
    optional: true,
    label: () => _i18n.__('Present mode')
  }
})

UsersSchemas.Settings = new SimpleSchema({
  viewMode: {
    type: UsersSchemas.ViewMode
  }
})

UsersSchemas.Main = new SimpleSchema({
  registered_emails: {
    type: [UsersSchemas.Email]
  },
  profile: {
    type: UsersSchemas.Profile
  },
  settings: {
    type: UsersSchemas.Settings
  }
})

export default UsersSchemas