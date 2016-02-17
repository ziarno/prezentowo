//defined in lib/config.jsx
SetLanguage('pl');
ConfigureAccountsTemplates();

Meteor.startup(function () {
  if (Meteor.isServer) {
    SimpleSchema.updateMessages();
  } else {
    //load on document ready
    $(SimpleSchema.updateMessages);
  }
});