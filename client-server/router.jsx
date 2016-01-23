FlowRouter.notFound = {
  action() {
    console.warn('404 :(');
  }
};

FlowRouter.route('/', {
  subscriptions() {

  },
  action() {
    ReactLayout.render(App);
  }
});