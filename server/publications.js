//Meteor.publish('Events', function () {
//  if (!this.userId) {
//    return this.ready();
//  }
//
//  return Events.find({
//    participants: {
//      $elemMatch: {
//        userId: this.userId
//      }
//    }
//  });
//});
//
//Meteor.publish('Presents', function () {
//  if (!this.userId) {
//    return this.ready();
//  }
//
//  return Events.find({
//    participants: {
//      $elemMatch: {
//        userId: this.userId
//      }
//    }
//  });
//});