import React from 'react'
import {LoggedIn} from '../../lib/Mixins'

var NotificationsMethods = {}

NotificationsMethods.seeAllNotifications = new ValidatedMethod({
  name: 'Notifications.methods.seeAllNotifications',
  mixins: [LoggedIn],
  validate: function() {},
  run() {
    Notifications.update({
      'seenByUsers.id': this.userId
    }, {
      $set: {
        'seenByUsers.$.seen': true
      }
    }, {
      multi: true
    })
  }
})

export default NotificationsMethods