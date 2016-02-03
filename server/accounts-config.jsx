//add a picture url to user's profile
Accounts.onCreateUser(function(options = {profile: {}}, user) {
  var email;

  if (user.services && user.services.facebook) {
    options.profile.picture =
      `http://graph.facebook.com/${user.services.facebook.id}/picture/?type=large`;
  } else {
    email = user.emails.length && user.emails[0].address;
    options.profile.picture = Gravatar.imageUrl(
      email, {secure: true, default: 'mm'}
    );
  }

  user.profile = options.profile;

  return user;
});