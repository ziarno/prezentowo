if (!Meteor.users.findOne()) {
  _.range(3).forEach(function() {
    var email = faker.internet.email();
    var name = faker.name.findName();
    var picture = faker.internet.avatar();
    var password = '123123';
    Accounts.createUser({
      profile: {name, picture},
      email,
      password
    });
  });
}