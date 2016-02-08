//var COUNTS = {
//  USERS: 5,
//  EVENTS: 1,
//  PARTICIPANTS: 2
//};
//var PASSWORD = '123123';
//var createdUsers = [];
//
//function getRandomNumber(max) {
//  return Math.floor(Math.random() * max);
//}
//
//function getRandom(arr, count = 1) {
//  var randomIndexes = [];
//  var index;
//  var returnArr = [];
//
//  while (count) {
//    index = getRandomNumber(arr.length);
//    if (randomIndexes.indexOf(index) === -1) {
//      randomIndexes.push(index);
//      count--;
//    }
//  }
//
//  randomIndexes.forEach(function (index) {
//    returnArr.push(arr[index]);
//  });
//
//  return returnArr.length === 1 ? returnArr[0] : returnArr;
//}
//
//faker.locale = "pl";
//
//// Create users
//if (!Meteor.users.findOne()) {
//  _.range(COUNTS.USERS).forEach(function() {
//    var user = {
//      email: faker.internet.email(),
//      name: faker.name.findName(),
//      picture: faker.internet.avatar(),
//      gender: Math.random() > 0.5 ? 'male' : 'female',
//      password: PASSWORD
//    };
//
//    user.id = Accounts.createUser({
//      profile: {
//        name: user.name,
//        picture: user.picture,
//        gender: user.gender},
//      email: user.email,
//      password: user.password
//    });
//
//    createdUsers.push(user);
//
//  });
//}
//
//// Create events
//if (!Events.findOne()) {
//  var users = Meteor.users.find({}, {limit: COUNTS.USERS}).fetch();
//
//  _.range(COUNTS.EVENTS).forEach(function(i) {
//    var eventCreator = getRandom(users);
//
//    Events.insert({
//      creatorId: eventCreator._id,
//      participants: getRandom(users, COUNTS.PARTICIPANTS).map((user) => {
//        return {
//          userId: user._id,
//          accepted: 'pending',
//          ownPresentsCount: 0,
//          otherPresentsCount: 0
//        }
//      }),
//      title: 'Christmas ' + i,
//      date: faker.date.future(),
//      type: getRandom(['many-to-many', 'many-to-one'])
//    });
//
//  });
//}
//
//if (!Presents.findOne())  {
//
//}