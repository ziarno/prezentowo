import React from 'react'

function setSidebarMode() {
  var sidebarFixedLimit = 925
  var currentWidth = $(window).width()
  Session.set('isSidebarFixed', currentWidth < sidebarFixedLimit)
}

function getClientLang() {
  return (
    navigator.languages && navigator.languages[0] ||
    navigator.language ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    'pl'
  ).match(/[a-z]{2}/)[0]
}

$.cloudinary.config({
  cloud_name: 'dyerfydu8'
})

Session.setDefault('event', {})

Meteor.startup(() => {
  var lang = getClientLang()

  setSidebarMode()
  $(window).resize(_.throttle(setSidebarMode, 1000))
  Language.set(lang)
})