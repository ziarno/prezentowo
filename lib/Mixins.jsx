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