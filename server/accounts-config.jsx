import React from 'react'

Accounts.onCreateUser(function(options = {profile: {}}, user) {
  var email

  //set picture url
  if (!options.profile.pictureUrl) {
    if (user.services && user.services.facebook) {
      options.profile.pictureUrl = `http://graph.facebook.com/${user.services.facebook.id}/picture/?type=large`

    } else {
      email = user.emails.length && user.emails[0].address
      options.profile.pictureUrl = Gravatar.imageUrl(email, {secure: true, default: 'mm'})
    }
  }

  //set gender
  if (!options.profile.gender) {
    if (user.services && user.services.facebook) {
      options.profile.gender = user.services.facebook.gender
    }
  }


  user.profile = options.profile

  return user
})