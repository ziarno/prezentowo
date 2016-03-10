$.cloudinary.config({
  cloud_name: 'dyerfydu8'
});

Meteor.startup(() => {
  ModalManager.init();
  Waves.init({
    delay: 0
  });
});