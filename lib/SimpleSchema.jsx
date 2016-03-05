/**
 * Updates error messages to current language
 */
SimpleSchema.updateMessages = function () {
  var messages = _i18n.__('SimpleSchema');

  if (_.isObject(messages)) {
    messages.regEx.forEach((msgObject) => {
      if (msgObject.expression) {
        msgObject.exp = SimpleSchema.RegEx[msgObject.expression]
      }
    });

    SimpleSchema.messages(messages);
  }
};

/**
 * Makes sure that an empty string
 * is an invalid value
 */
SimpleSchema.addValidator(function () {
  if (!this.definition.optional &&
      this.value === '') {
    return 'required';
  }
});

//SimpleSchema.debug = true; //TODO: remove

