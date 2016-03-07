InputValidationMixin = {

  mixins: [ReactMeteorData],

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

  getMeteorData() {
    return {
      hasError: this.context.schema && this.context.schema.keyIsInvalid(this.props.name)
    }
  },

  getInitialState() {
    return {showError: false};
  },

  hideError() {
    this.setState({showError: false});
  },

  showError() {
    this.setState({showError: true});
  },

  onChange(value) {
    var valueObject = {[this.props.name]: value};

    this.context.form.setState(valueObject);
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(valueObject);
    }
  },

  shouldShowError() {
    return this.state.showError && this.data.hasError;
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