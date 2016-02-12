Meteor.startup(() => {
  ModalManager.init();
  Waves.init({
    delay: 0
  })
});