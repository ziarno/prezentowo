import Autorun from './Autorun';

/**
 * Input Validation Mixin
 *
 * Requires:
 * - a parent Form element which provides context
 */
var InputValidation = {

  mixins: [Autorun],

  propTypes: {
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    className: React.PropTypes.string
  },

  contextTypes: {
    register: React.PropTypes.func,
    schema: React.PropTypes.object,
    form: React.PropTypes.object
  },

  getInitialState() {
    return {
      showError: false,
      hasError: false
    };
  },

  autorunValidation() {
    this.setState({
      hasError: this.context.schema && this.context.schema.keyIsInvalid(this.props.name)
    });
  },

  hideError() {
    this.setState({showError: false});
  },

  showError() {
    this.setState({showError: true});
  },

  onChange(value) {
    var valueObject = {[this.props.name]: value};

    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(valueObject);
    }
  },

  shouldShowError() {
    return this.state.showError && this.state.hasError;
  },

  componentDidMount() {
    if (this.context.register) {
      this.context.register(this);
    }
  },

  validate(value) {
    this.setState({showError: true});
    if (this.context.schema) {
      this.context.schema.validateOne({
        [this.props.name]: value
      }, this.props.name);
    }
  }

};

export default InputValidation;