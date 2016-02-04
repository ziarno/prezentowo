Mixins = {
  loggedIn: RestrictMixin.createMixin({
    condition() {
      return !this.userId
    },
    error() {
      return new Meteor.Error(
        `${this.name}.unauthorized`,
        _i18n.__('Must be logged in')
      );
    }
  })
};