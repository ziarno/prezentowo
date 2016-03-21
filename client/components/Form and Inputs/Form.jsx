import {Autorun} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

/**
 * Form
 *
 * Use the register() method in child components
 * provided by the context to register inputs
 *
 * Requires:
 * - child input components that are registered must provide
 *   reset() and getValue() methods
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

    this.state.components.forEach((component) => {
      component.setValue(data[component.props.name])
    })
  }

  submitForm(event) {
    var formValues = {}

    event.preventDefault()
    this.state.components.forEach((component) => {
      formValues[component.props.name] = component.getValue()
    })

    if (_.isFunction(this.props.onSubmit)) {
      this.props.onSubmit(formValues)
    }
  }

  componentDidMount() {
    this.setFormData(this.props.data)
  }

  componentWillReceiveProps({data}) {
    this.setFormData(data)
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