/**
 *
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
var Dropdown = {
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

export default Dropdown;