Meteor.publish('Events', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Events.find({
    participants: {
      $elemMatch: {
        id: this.userId
      }
    }
  });
});