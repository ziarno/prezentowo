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
 * Name attributes of objects can be dot-separated, ex: a.b.c
 */
Form = class Form extends React.Component {

  constructor() {
    super()
    this.state = {
      components: [],
      hasError: false
    }
    this.autorunSetError = this.autorunSetError.bind(this)
    this.reset = this.reset.bind(this)
    this.setFormData = this.setFormData.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }
  
  getChildContext() {
    return {
      register: (inputComponent) => {
        if (!_.isFunction(inputComponent.getValue) || !_.isFunction(inputComponent.getValue)) {
          throw new Error(`${inputComponent.constructor.displayName} component must have a getValue() and reset() methods in order to be registered as an input in the Form component`)
        }
        this.state.components.push(inputComponent)
      },
      schema: this.props.schema,
      form: this
    }
  }

  autorunSetError() {
    this.setState({
      hasError: !this.props.schema.isValid()
    })
  }

  reset() {
    if (this.props.data) {
      this.setFormData(this.props.data)
    } else {
      this.state.components.forEach((component) => component.reset())
    }
    this.props.schema.resetValidation()
  }

  setFormData(data) {
    if (!_.isObject(data)) {
      return
    }

    var flatData = flattenObject(data)

    this.state.components.forEach((component) => {
      component.setValue(flatData[component.props.name])
    })
  }

  submitForm(event) {
    var flatFormValues = {}
    var formValues

    event && event.preventDefault()
    this.state.components.forEach((component) => {
      flatFormValues[component.props.name] = component.getValue()
    })

    formValues = unflattenObject(flatFormValues)

    if (this.props.schema.validate(formValues) &&
        _.isFunction(this.props.onSubmit)) {
      this.props.onSubmit(formValues)
    }
  }

  componentDidMount() {
    this.setFormData(this.props.data)
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
        onSubmit={this.submitForm}
      >
        {this.props.children}
      </form>
    )
  }
}

Form.propTypes = {
  schema: React.PropTypes.object.isRequired,
  className: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
  data: React.PropTypes.object
}

Form.childContextTypes = {
  register: React.PropTypes.func,
  schema: React.PropTypes.object,
  form: React.PropTypes.object
}

reactMixin(Form.prototype, Autorun)