AccountsTemplates.configure({
  //useraccounts:flow-routing setup
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
    displayName: "Imię i nazwisko",
    placeholder: "Imię i nazwisko"
  },
  email,
  {
    _id: "gender",
    type: "radio",
    required: true,
    displayName: "Płeć",
    select: [
      {
        text: "Kobieta",
        value: "female"
      },
      {
        text: "Mężczyzna",
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