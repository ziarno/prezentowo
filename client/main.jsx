import React from 'react'
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'

function setSidebarMode() {
  const sidebarFixedLimit = 925
  const currentWidth = $(window).width()
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
  const lang = getClientLang()

  setSidebarMode()
  $(window).resize(_.throttle(setSidebarMode, 1000))
  Language.set(lang)
})
