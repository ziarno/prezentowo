import moment from 'moment';

Language = {

  currentLanguage: 'pl',

  set(lang) {
    //universe:i18n
    var promise = _i18n.setLocale(lang);

    if (promise && promise.then) {
      promise.then(SimpleSchema.updateMessages);
    }

    //i18n for AccountsTemplates
    T9n.setLanguage(lang);

    //momentjs
    moment.locale(lang);

    this.currentLanguage = lang;
  },

  get() {
    return this.currentLanguage;
  }

};