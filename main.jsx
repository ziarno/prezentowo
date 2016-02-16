//defined in lib/config.jsx
ConfigureAccountsTemplates();
SetLanguage('pl');

Meteor.startup(function () {
  if (Meteor.isServer) {
    SimpleSchema.updateMessages();
  } else {
    //load on document ready
    $(SimpleSchema.updateMessages);
  }
});