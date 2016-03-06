InputValidationMixin = {

  mixins: [ReactMeteorData],

  propTypes: {
    name: React.PropTypes.string.isRequired,
    schema: React.PropTypes.object,
    onChange: React.PropTypes.func,
    className: React.PropTypes.string
  },

  getMeteorData() {
    return {
      hasError: this.props.schema && this.props.schema.keyIsInvalid(this.props.name)
    }
  },

  getInitialState() {
    return {
      showError: false
    };
  },

  hideError() {
    this.setState({showError: false});
  },

  showError() {
    this.setState({showError: true});
  },

  onChange(value) {
    this.props.onChange({
      [this.props.name]: value
    });
  },

  shouldShowError() {
    return this.state.showError && this.data.hasError;
  },

  validate(value) {
    this.setState({showError: true});
    if (this.props.schema) {
      this.props.schema.validateOne({
        [this.props.name]: value
      }, this.props.name);
    }
  }

};