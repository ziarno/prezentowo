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