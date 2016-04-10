import React from 'react'

function setSidebarMode() {
  var sidebarFixedLimit = 720
  var currentWidth = $(window).width()
  Session.set('isSidebarFixed', currentWidth < sidebarFixedLimit)
}

$.cloudinary.config({
  cloud_name: 'dyerfydu8'
})

Session.setDefault('event', {})

Meteor.startup(() => {
  ModalManager.init()
  setSidebarMode()
  $(window).resize(_.throttle(setSidebarMode, 1000))
})