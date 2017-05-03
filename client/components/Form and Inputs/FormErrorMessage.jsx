import React, { Component, PropTypes } from 'react'
import { Autorun } from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

FormErrorMessage = class FormErrorMessage extends Component {

  constructor() {
    super()
    this.state = {
      errors: []
    }
    this.autorunGetErrorMessages = this.autorunGetErrorMessages.bind(this)
  }
  
  autorunGetErrorMessages() {
    const {
      schema
    } = this.context
    this.setState({
      errors: schema.invalidKeys().map((key) => (
        schema.keyErrorMessage(key.name)
      ))
    })
  }

  render() {
    const shouldBeVisible = this.state.errors.length
      && this.context.form.hasSubmitted

    return (
      <Message
        hidden={!shouldBeVisible}
        className="form-popup--error icon attached fluid error"
        icon="warning"
        messages={this.state.errors}
      />
    )
  }

}

FormErrorMessage.contextTypes = {
  schema: PropTypes.object,
  form: PropTypes.object
}

reactMixin(FormErrorMessage.prototype, Autorun)
