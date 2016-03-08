Mixins = {};

/**
 * VALIDATED METHOD MIXINS
 */
Mixins.LoggedIn = function loggedInMixin(methodOptions) {
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
Mixins.Dropdown = {
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
 * TOOLTIPS MIXIN
 *
 * There are no 'tooltips' in semantic ui, only popups.
 * Tooltips = small popups.
 *
 * Requires:
 * getTooltips() method - must return an object:
 * {
 *  ref: {tooltipConfig},
 *  ...
 * }
 * Note: Add refs to components
 */
Mixins.Tooltips = {

  defaultConfig: {
    variation: 'inverted tiny',
    position: 'bottom center',
    delay: {
      show: 500,
      hide: 0
    },
    duration: 100
  },

  componentDidMount() {
    this.setTooltips();
    _i18n.onChangeLocale(this.setTooltips);
  },

  componentWillUnmount() {
    this.invokeTooltipsWith('destroy');
    _i18n.offChangeLocale(this.setTooltips);
  },

  setTooltips() {
    this.invokeTooltipsWith((tooltipConfig) => ({
      ...this.defaultConfig,
      ...tooltipConfig
    }));
  },

  hideTooltips() {
    this.invokeTooltipsWith('hide');
  },

  invokeTooltipsWith(action) {
    var tooltips = _.isFunction(this.getTooltips) ?
      this.getTooltips() : {};

    _.each(tooltips, (tooltipConfig, key) => {
      var tooltipAction = _.isFunction(action) ?
        action(tooltipConfig, key) : action;

      $(this.refs[key]).popup(tooltipAction);
    }, this);
  }

};


/**
 * AUTORUN MIXIN
 *
 * source: https://github.com/vazco/meteor-universe-utilities-react/blob/master/mixins/autorun.import.jsx
 */
Mixins.Autorun = {
  componentWillMount () {
    for (let method in this) {
      if (this.hasOwnProperty(method) && method.indexOf('autorun', 0) === 0) {
        const methodComputation = method + 'Computation';

        if (this[methodComputation] === undefined) {
          this[methodComputation] = Tracker.nonreactive(() => {
            // we put this inside nonreactive to be sure that it won't be related to any other computation
            return Tracker.autorun(this[method]);
          });
        }
      }
    }
  },

  componentWillUnmount () {
    for (let method in this) {
      if (this.hasOwnProperty(method) && method.indexOf('autorun', 0) === 0) {
        const methodComputation = method + 'Computation';

        if (this[methodComputation]) {
          this[methodComputation].stop();
          this[methodComputation] = null;
        }
      }
    }
  }
};