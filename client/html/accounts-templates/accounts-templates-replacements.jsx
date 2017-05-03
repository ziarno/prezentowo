import React from 'react'
import { Template } from 'meteor/templating'
import { AccountsTemplates } from 'meteor/useraccounts:core'

/**
 * Accounts Templates - templates
 * overrides settings
 */

const genderIconNames = {
  male: 'man',
  female: 'woman'
}

function retriggerDropdownEvents() {
  //must retrigger events because AT
  //listens for events on input
  this.$('.ui.dropdown')
    .dropdown({
      onChange() {
        $(this)
          .find('input')
          .trigger('focusout')
      },
      onShow() {
        $(this)
          .find('input')
          .trigger('focusin')
      }
    })
}

Template.customAtPwdFormBtn.replaces('atPwdFormBtn')
Template.customFullPageAtForm.replaces('fullPageAtForm')
Template.atSelectInput.onRendered(retriggerDropdownEvents)
Template.genderInput.onRendered(retriggerDropdownEvents)
Template.genderInput.helpers({
  getIconName: gender => genderIconNames[gender],
  ...AccountsTemplates.atInputHelpers
})
