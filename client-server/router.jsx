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

FlowRouter.route('/login', {
  action() {
    ReactLayout.render(App, {content: <AccountsTemplates />});
  }
});