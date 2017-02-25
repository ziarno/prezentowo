import React from 'react'
import moment from 'moment'
import _ from 'underscore'

Language = {

  supportedLanguages: ['pl', 'en'],

  currentLanguage: 'pl',

  set(lang) {
    if (!_.contains(this.supportedLanguages, lang)) {
      lang = this.supportedLanguages[0]
    }

    //universe:i18n
    var promise = _i18n.setLocale(lang)

    if (promise && promise.then) {
      promise.then(SimpleSchema.updateMessages)
    }

    //i18n for AccountsTemplates
    T9n.setLanguage(lang)

    //momentjs
    moment.locale(lang)

    this.currentLanguage = lang
  },

  get() {
    return this.currentLanguage
  }

}