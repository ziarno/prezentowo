Accounts.onCreateUser(function(options = {profile: {}}, user) {
  var email;

  //set picture url
  if (!options.profile.pictureUrl) {
    if (user.services && user.services.facebook) {
      options.profile.pictureUrl = {
        large: `http://graph.facebook.com/${user.services.facebook.id}/picture/?type=large`,
        small: `http://graph.facebook.com/${user.services.facebook.id}/picture/?type=small`
      }

    } else {
      email = user.emails.length && user.emails[0].address;
      options.profile.pictureUrl = {
        large: Gravatar.imageUrl(email, {secure: true, default: 'mm'}),
        small: Gravatar.imageUrl(email, {secure: true, default: 'mm', size: 40})
      }
    }
  }

  //set gender
  if (!options.profile.gender) {
    if (user.services && user.services.facebook) {
      options.profile.gender = user.services.facebook.gender;
    }
  }


  user.profile = options.profile;

  return user;
});