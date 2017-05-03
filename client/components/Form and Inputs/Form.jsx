import React, { Component, PropTypes } from 'react'
import reactMixin from 'react-mixin'
import _ from 'underscore'
import { classNames } from 'meteor/maxharris9:classnames'
import { Autorun } from '../../../lib/Mixins'
import { 
  flattenObject,
  unflattenObject
} from '../../../lib/utilities'

/**
 * Form
 *
 * Use the register() method in child components
 * provided by the context to register inputs
 *
 * Requires:
 * - child input components that are registered must provide
 *   reset(), setValue() and getValue() methods
 *
 * Note: keys defined in the provided schema must match
 * name attributes in inputs inside the form
 *
 * Name attributes of objects can be dot-separated, ex: a.b.c
 * if flattenData prop is set to true - name your inputs
 * this way also, ex. <Input name="profile.name" />
 */
Form = class Form extends Component {

  constructor(props) {
    super(props)
    this.state = {
      components: [],
      hasError: false
    }
    this.hiddenFields = {}
    this.hasSubmitted = false
    this.isDisabled = props.disabled
    this.autorunSetError = this.autorunSetError.bind(this)
    this.reset = this.reset.bind(this)
    this.setFormData = this.setFormData.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }
  
  getChildContext() {
    return {
      register: (inputComponent) => {
        if (!_.isFunction(inputComponent.getValue) ||
            !_.isFunction(inputComponent.setValue)) {
          throw new Error(`${inputComponent.constructor.displayName} component must have a getValue() and reset() methods in order to be registered as an input in the Form component`)
        }
        this.state.components.push(inputComponent)
      },
      schema: this.props.schema,
      form: this
    }
  }

  autorunSetError() {
    const { schema } = this.props
    this.setState({
      hasError: schema && !schema.isValid()
    })
  }

  reset() {
    const {
      schema,
      data
    } = this.props

    this.hasSubmitted = false
    this.hiddenFields = {}
    if (data) {
      this.setFormData(data)
    } else {
      this.state.components.forEach((component) => component.reset())
    }
    schema && schema.resetValidation()
    return this
  }

  setHiddenFields(fieldsObject) {
    this.hiddenFields = {
      ...this.hiddenFields,
      ...fieldsObject
    }
  }

  setFormData(data) {
    if (!_.isObject(data)) {
      return
    }

    const flatData = this.props.flattenData ?
      flattenObject(data) : data

    this.state.components.forEach((component) => {
      component.setValue(flatData[component.props.name])
    })
    return this
  }

  setDisabled(isDisabled) {
    this.isDisabled = isDisabled
    this.state.components.forEach((component) => {
      component.setDisabled(isDisabled)
    })
    return this
  }

  submitForm(event) {
    const {
      schema,
      onSubmit,
      flattenData
    } = this.props
    const flatFormValues = {}
    let formValues

    event && event.preventDefault()
    this.hasSubmitted = true
    this.state.components.forEach((component) => {
      flatFormValues[component.props.name] = component.getValue()
    })

    formValues = {
      ...this.hiddenFields,
      ...(flattenData ?
        unflattenObject(flatFormValues) : flatFormValues)
    }

    if (!schema || schema.validate(formValues) &&
        _.isFunction(onSubmit)) {
      onSubmit(formValues)
    }
    return this
  }

  componentDidMount() {
    this.setFormData(this.props.data)
    this.setHiddenFields(this.props.hiddenFields)
  }

  componentWillReceiveProps({data}) {
    if (!_.isEqual(this.props.data, data)) {
      this.setFormData(data)
    }
  }

  render() {
    return (
      <form
        className={classNames('ui form', this.props.className, {
          error: this.state.hasError
        })}
        onSubmit={this.submitForm}>
        {this.props.children}
      </form>
    )
  }
}

Form.propTypes = {
  schema: PropTypes.object,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  data: PropTypes.object,
  flattenData: PropTypes.bool,
  hiddenFields: PropTypes.object
}

Form.childContextTypes = {
  register: PropTypes.func,
  schema: PropTypes.object,
  form: PropTypes.object
}

reactMixin(Form.prototype, Autorun)
