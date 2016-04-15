import React from 'react'
import Autorun from './Autorun'
import reactMixin from 'react-mixin'
import {unflattenObject} from '../utilities'

/**
 * Input Validation Mixin
 *
 * Requires:
 * - a parent Form element which provides context
 */
var ValidatedInput = class ValidatedInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showError: true,
      hasError: false,
      disabled: false
    }
    //fieldName is the last name part (if name is dot-separated)
    //ex. name = a.b.c, then fieldName = c
    this.fieldName = _.last(props.name.split('.'))
    this.autorunValidation = this.autorunValidation.bind(this)
    this.hideError = this.hideError.bind(this)
    this.showError = this.showError.bind(this)
    this.onChange = this.onChange.bind(this)
    this.shouldShowError = this.shouldShowError.bind(this)
    this.validate = this.validate.bind(this)
    this.setDisabled = this.setDisabled.bind(this)
    this.isDisabled = this.isDisabled.bind(this)
  }

  autorunValidation() {
    var name = this.fieldName

    this.setState({
      hasError: this.context.schema &&
        this.context.schema.keyIsInvalid(name)
    })
  }

  //override
  getValue() {
    return this.props.staticValue
  }

  //override
  //note: should not trigger onChange or validation -
  // should set the value silently
  setValue() {}

  hideError() {
    this.setState({showError: false})
  }

  showError() {
    this.setState({showError: true})
  }

  setDisabled(val) {
    this.setState({disabled: !!val})
  }

  isDisabled() {
    return this.props.disabled
      || this.state.disabled
      || this.context.form.isDisabled
  }

  onChange(value) {
    var name = this.fieldName
    var valueObject = {[name]: value}

    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(valueObject)
    }
  }

  shouldShowError() {
    return this.state.showError &&
      this.state.hasError &&
      this.context.form.hasSubmitted
  }

  componentDidMount() {
    if (this.context.register) {
      this.context.register(this)
    }
  }

  validate(value, silent) {
    if (!silent) {
      this.showError()
    }
    if (this.context.schema) {
      this.context.schema.validateOne(unflattenObject({
        [this.props.name]: value
      }), this.props.name)
    }
  }

  //override
  render() {
    return this.props.children
  }

}

ValidatedInput.propTypes = {
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  staticValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool
  ])
}

ValidatedInput.contextTypes = {
  register: React.PropTypes.func,
  schema: React.PropTypes.object,
  form: React.PropTypes.object
}

reactMixin(ValidatedInput.prototype, Autorun)

export default ValidatedInput