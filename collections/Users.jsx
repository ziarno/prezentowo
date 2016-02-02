Meteor.users.findByEmail = function (email) {
  return Meteor.users.findOne({$or: [
    {'services.facebook.email': email},
    {'emails': {$elemMatch: {address: email}}}
  ]});
};

Meteor.users.helpers({
  email() {
    return (this.emails && this.emails[0].address) || this.services.facebook.email;
  }
});