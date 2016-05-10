import React from 'react'
import {getAvatarImages} from '../lib/utilities'
import {HTTP} from 'meteor/http'

Accounts.onCreateUser(function(options = {profile: {}}, user) {
  var email
  var pictureUrl

  //set gender
  if (!options.profile.gender) {
    if (user.services && user.services.facebook) {
      options.profile.gender = user.services.facebook.gender
    }
  }

  //set picture url
  if (!options.profile.pictureUrl) {
    if (user.services && user.services.facebook) {
      options.profile.pictureUrl =
        `http://graph.facebook.com/${user.services.facebook.id}/picture/?type=large`
    } else {
      //try gravatar
      try {
        email = user.emails[0].address
        pictureUrl = Gravatar.imageUrl(email, {secure: true, default: '404'})
        HTTP.get(pictureUrl) //throws if no image
      } catch (e) {
        pictureUrl = getAvatarImages(options.profile.gender)[0]
      }
      options.profile.pictureUrl = pictureUrl
    }
  }

  //set default settings
  user.settings = {
    viewMode: {
      participantsMode: Users.defaults.participantsMode,
      presentMode: Users.defaults.presentMode
    }
  }

  user.profile = options.profile

  return user
})