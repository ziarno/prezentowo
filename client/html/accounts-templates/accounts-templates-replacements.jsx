Template.customAtPwdFormBtn.replaces('atPwdFormBtn');
Template.customAtSelectInput.replaces('atSelectInput');
Template.atSelectInput.onRendered(function () {
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
});