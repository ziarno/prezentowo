import React from 'react'

SchemaFields = {
  Id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  Email: {
    type: String,
    custom: function () {
      //only check regex if value is not empty
      if (this.value && !
          SimpleSchema.RegEx.Email.test(this.value)) {
        return 'invalidEmail'
      }
    }
  },
  Gender: {
    type: String,
    allowedValues: ['male', 'female'],
    label: () => _i18n.__('Gender')
  },
  PictureUrl: {
    type: String,
    label: () => _i18n.__('Picture')
  },
  Name: {
    type: String,
    label: () => _i18n.__('Fullname')
  },
  Date: {
    type: Date,
    label: () => _i18n.__('Date')
  },
  CreatedAt: {
    type: Date,
    label: () => _i18n.__('Created'),
    autoValue() {
      if (this.isInsert) {
        return new Date()
      }
    }
  },
  CreatorId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: () => _i18n.__('Creator'),
    autoValue() {
      if (this.isSet) {
        return this.value
      }
      if (this.isInsert) {
        return this.userId
      }
    }

  }
}