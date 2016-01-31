//i18n for AccountsTemplates
T9n.setLanguage('pl');

//i18n component
_i18n.setLocale('pl');
T = _i18n.createComponent();

/**
 * Configuration for AccountsTemplates.
 * Must be called last (in main.jsx) because it
 * needs a reference to <App /> and <Header />
 */
ConfigureAccountsTemplates = function () {
  AccountsTemplates.configure({
    // useraccounts:flow-routing setup
    defaultLayoutType: 'blaze-to-react',
    defaultLayout: App,
    defaultLayoutRegions: {
      nav: <Header />
    },
    defaultContentRegion: 'content',

    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: false,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: false,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: function(){},
    //onSubmitHook: function(){},
    //preSignUpHook: function(){},
    //postSignUpHook: function(){},

  });

  var password = AccountsTemplates.removeField('password');
  var email = AccountsTemplates.removeField('email');

  AccountsTemplates.addFields([
    {
      _id: 'name',
      type: 'text',
      required: true,
      displayName: _i18n.__('Fullname'),
      placeholder: _i18n.__('Fullname')
    },
    email,
    {
      _id: "gender",
      type: "radio",
      required: true,
      displayName: _i18n.__('Gender'),
      select: [
        {
          text: _i18n.__('Female'),
          value: "female"
        },
        {
          text: _i18n.__('Male'),
          value: "male"
        }
      ]
    },
    password
  ]);

  AccountsTemplates.configureRoute('signIn');
  AccountsTemplates.configureRoute('signUp');
  AccountsTemplates.configureRoute('changePwd');
  AccountsTemplates.configureRoute('forgotPwd');
  AccountsTemplates.configureRoute('resetPwd');
  AccountsTemplates.configureRoute('enrollAccount');
}