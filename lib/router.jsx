FlowRouter.notFound = {
  action() {
    console.warn('404 :(');
  }
};

FlowRouter.route('/', {
  action() {
    ReactLayout.render(App);
  }
});

FlowRouter.route('/event/:eventId', {
  action() {
    ReactLayout.render(App, {
      content: <EventContainer />
    });
  }
});