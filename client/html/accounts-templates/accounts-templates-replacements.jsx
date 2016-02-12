/**
 * Accounts Templates - templates
 * overrides settings
 */

var genderIconNames = {
  male: 'man',
  female: 'woman'
};

function retriggerDropdownEvents() {
  //must retrigger events because AT
  //listens for events on input
  this.$('.ui.dropdown')
    .dropdown({
      onChange() {
        $(this).find('input').trigger('focusout');
      },
      onShow() {
        $(this).find('input').trigger('focusin');
      }
    })
}

Template.customAtPwdFormBtn.replaces('atPwdFormBtn');
Template.atSelectInput.onRendered(retriggerDropdownEvents);
Template.genderInput.onRendered(retriggerDropdownEvents);
Template.genderInput.helpers({
  getIconName: (gender) => genderIconNames[gender],
  ...AccountsTemplates.atInputHelpers
});