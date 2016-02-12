ConfigureAccountsTemplates(); //defined in lib/config.jsx

Meteor.startup(function () {
  Meteor.setTimeout(SimpleSchema.updateMessages);
});