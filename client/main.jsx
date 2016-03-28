import React from 'react'

$.cloudinary.config({
  cloud_name: 'dyerfydu8'
})

Session.setDefault('event', {})
Session.setDefault('currentUser', {})
Session.setDefault('participants', [])

Meteor.startup(() => {
  ModalManager.init()
})