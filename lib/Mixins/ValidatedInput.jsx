import Autorun from './Autorun'
import reactMixin from 'react-mixin'

/**
 * Input Validation Mixin
 *
 * Requires:
 * - a parent Form element which provides context
 */
var ValidatedInput = class ValidatedInput extends React.Component {

  constructor() {
    super()
    this.state = this.getDefaultState()
    this.autorunValidation = this.autorunValidation.bind(this)
    this.hideError = this.hideError.bind(this)
    this.showError = this.showError.bind(this)
    this.onChange = this.onChange.bind(this)
    this.shouldShowError = this.shouldShowError.bind(this)
    this.validate = this.validate.bind(this)
  }

  //note: custom function, not React's getInitialState
  getDefaultState() {
    return {
      showError: false,
      hasError: false
    }
  }

  autorunValidation() {
    this.setState({
      hasError: this.context.schema &&
        this.context.schema.keyIsInvalid(this.props.name)
    })
  }

  hideError() {
    this.setState({showError: false})
  }

  showError() {
    this.setState({showError: true})
  }

  onChange(value) {
    var valueObject = {[this.props.name]: value}

    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(valueObject)
    }
  }

  shouldShowError() {
    return this.state.showError && this.state.hasError
  }

  componentDidMount() {
    if (this.context.register) {
      this.context.register(this)
    }
  }

  validate(value, silent) {
    if (!silent) {
      this.setState({showError: true})
    }
    if (this.context.schema) {
      this.context.schema.validateOne({
        [this.props.name]: value
      }, this.props.name)
    }
  }

}

ValidatedInput.propTypes = {
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func
}

ValidatedInput.contextTypes = {
  register: React.PropTypes.func,
  schema: React.PropTypes.object,
  form: React.PropTypes.object
}

reactMixin(ValidatedInput.prototype, Autorun)

export default ValidatedInput