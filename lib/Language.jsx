import moment from 'moment';

Language = {

  currentLanguage: 'pl',

  set(lang) {
    //i18n for AccountsTemplates
    T9n.setLanguage(lang);

    //momentjs
    moment.locale(lang);

    //universe:i18n
    _i18n.setLocale(lang);

    SimpleSchema.updateMessages();

    this.currentLanguage = lang;
  },

  get() {
    return this.currentLanguage;
  }

};