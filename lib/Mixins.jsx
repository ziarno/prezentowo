Mixins = {};

Mixins.loggedIn = function loggedInMixin(methodOptions) {
  var originalRun = methodOptions.run;
  if (_.isFunction(originalRun)) {
    methodOptions.run = function () {
      if (!this.userId) {
        throw new Meteor.Error(
          `${this.name}.unauthorized`,
          _i18n.__('Must be logged in')
        );
      }
      return originalRun.apply(this, arguments);
    };
  }

  return methodOptions;
};
