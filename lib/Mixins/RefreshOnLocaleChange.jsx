/**
 * copied from universe:i18n
 * (I don't know how to import this from universe:i18n! :( )
 * source: https://github.com/vazco/meteor-universe-i18n/blob/master/lib/i18n.js#L260
 */
var RefreshOnLocaleChange = {
  _localeChanged (locale) {
    this.setState({locale});
  },
  componentWillMount () {
    _i18n.onChangeLocale(this._localeChanged);
  },
  componentWillUnmount () {
    _i18n.offChangeLocale(this._localeChanged);
  }
};

export default RefreshOnLocaleChange;