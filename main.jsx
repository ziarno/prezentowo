ConfigureAccountsTemplates(); //defined in lib/config.jsx

Meteor.startup(function () {
  if (Meteor.isServer) {
    SimpleSchema.updateMessages();
  } else {
    //load on document ready
    $(SimpleSchema.updateMessages);
  }
});