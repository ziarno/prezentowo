Mixins = {};

/**
 * VALIDATED METHOD MIXINS
 */
Mixins.loggedIn = function loggedInMixin(methodOptions) {
  var originalRun = methodOptions.run;
  if (_.isFunction(originalRun)) {
    methodOptions.run = function () {
      if (!this.userId) {
        throw new Meteor.Error(
          `${this.name}.unauthorized`,
          _i18n.__('Must be logged in')
        );
      }
      return originalRun.apply(this, arguments);
    };
  }

  return methodOptions;
};

/**
 * REACT MIXINS
 */

/**
 * DROPDOWN MIXIN
 *
 * This exists because semantic-ui normally
 * requires the dropdown content to be *inside*
 * the button which triggers it - requires
 * overflow: visible, and the *ripple effect*
 * requires overflow: hidden;
 *
 * Requires:
 * refs: dropdown-trigger and dropdown
 * dropdownOptions (optional)
 */
Mixins.dropdown = {
  componentDidMount() {
    this.$dropdownTrigger = $(this.refs['dropdown-trigger']);
    this.$dropdown = $(this.refs.dropdown);

    if (this.$dropdown && this.$dropdownTrigger) {
      this.$dropdown.dropdown({
        action: 'hide',
        onShow: () => this.$dropdownTrigger.addClass('active'),
        onHide: () => this.$dropdownTrigger.removeClass('active'),
        ...this.dropdownOptions
      });
      this.$dropdownTrigger
        .on('click', () => {
          this.$dropdown.dropdown('show')
        })
        .css('border-radius', '4px');
    }
  }
};

/**
 * POPUPS MIXIN
 *
 * Requires:
 * getPopups() method - must return an object:
 * {
 *  refKey: {popupConfig},
 *  ...
 * }
 * Note: Add refKeys to components' refs
 */
Mixins.popup = {

  defaultConfig: {
    variation: 'inverted tiny',
    position: 'bottom center',
    delay: {
      show: 300,
      hide: 0
    }
  },

  componentDidMount() {
    this.setPopups();
    _i18n.onChangeLocale(this.setPopups);
  },

  componentWillUnmount() {
    this.invokePopupsWith('destroy');
    _i18n.offChangeLocale(this.setPopups);
  },

  setPopups() {
    this.invokePopupsWith((popupConfig) => ({
      ...this.defaultConfig,
      ...popupConfig
    }));
  },

  hidePopups() {
    this.invokePopupsWith('hide');
  },

  invokePopupsWith(action) {
    var popups = _.isFunction(this.getPopups) ?
      this.getPopups() : {};

    _.each(popups, (popupConfig, key) => {
      var popupAction = _.isFunction(action) ?
        action(popupConfig, key) : action;

      $(this.refs[key]).popup(popupAction);
    }, this);
  }

};