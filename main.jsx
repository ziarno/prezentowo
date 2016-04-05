import React from 'react'

//defined in lib/config.jsx
Language.set('pl')
ConfigureAccountsTemplates()

Meteor.startup(function () {
  if (Meteor.isServer) {
    SimpleSchema.updateMessages()
  } else {
    //load on document ready
    $(SimpleSchema.updateMessages)
  }
})