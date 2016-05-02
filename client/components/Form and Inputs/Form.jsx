import React from 'react'
import {Autorun} from '../../../lib/Mixins'
import {flattenObject, unflattenObject} from '../../../lib/utilities'
import reactMixin from 'react-mixin'

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
Form = class Form extends React.Component {

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
    var {schema} = this.props

    this.setState({
      hasError: schema && !schema.isValid()
    })
  }

  reset() {
    var {schema} = this.props

    this.hasSubmitted = false
    this.hiddenFields = {}
    if (this.props.data) {
      this.setFormData(this.props.data)
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

    var flatData = this.props.flattenData ?
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
    var {schema, onSubmit, flattenData} = this.props
    var flatFormValues = {}
    var formValues

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
  schema: React.PropTypes.object,
  className: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
  data: React.PropTypes.object,
  flattenData: React.PropTypes.bool,
  hiddenFields: React.PropTypes.object
}

Form.childContextTypes = {
  register: React.PropTypes.func,
  schema: React.PropTypes.object,
  form: React.PropTypes.object
}

reactMixin(Form.prototype, Autorun)