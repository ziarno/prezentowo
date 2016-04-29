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
    var {schema} = this.context
    var name = this.fieldName

    this.setState({
      hasError: schema && schema.keyIsInvalid(name)
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
    var {form} = this.context

    return this.props.disabled
      || this.state.disabled
      || (form && form.isDisabled)
  }

  onChange(value) {
    var {onChange} = this.props
    var name = this.fieldName
    var valueObject = {[name]: value}

    if (_.isFunction(onChange)) {
      onChange(valueObject)
    }
  }

  shouldShowError() {
    var {form} = this.context
    var {showError, hasError} = this.state

    return showError && hasError &&
      form && form.hasSubmitted
  }

  componentDidMount() {
    var {register} = this.context

    if (register) {
      register(this)
    }
  }

  validate(value, silent) {
    var {schema} = this.context
    var {name} = this.props

    if (!silent) {
      this.showError()
    }
    schema && schema.validateOne(unflattenObject({
      [name]: value
    }), name)
  }

  //override
  render() {
    return this.props.children || null
  }

}

ValidatedInput.propTypes = {
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  staticValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool,
    React.PropTypes.array
  ])
}

ValidatedInput.contextTypes = {
  register: React.PropTypes.func,
  schema: React.PropTypes.object,
  form: React.PropTypes.object
}

reactMixin(ValidatedInput.prototype, Autorun)

export default ValidatedInput