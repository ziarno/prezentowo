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

//AccountsTemplates.configureRoute('signIn');
//AccountsTemplates.configureRoute('signUp');
////AccountsTemplates.configureRoute('changePwd');
////AccountsTemplates.configureRoute('forgotPwd');
//AccountsTemplates.configureRoute('resetPwd');
//AccountsTemplates.configureRoute('enrollAccount');
//
//FlowRouter.route('/login', {
//  action() {
//    ReactLayout.render(App, {content: <AccountsTemplates />});
//  }
//});