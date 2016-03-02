Input = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      error: this.props.schema &&
        this.props.schema.keyErrorMessage(this.props.name)
    };
  },

  propTypes: {
    name: React.PropTypes.string.isRequired,
    schema: React.PropTypes.object,
    onChange: React.PropTypes.func,
    className: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string
  },

  getInitialState() {
    return {showError: true};
  },

  hideError() {
    this.setState({showError: false});
  },

  onChange(event) {
    if (this.props.onChange) {
      this.props.onChange({
        [this.props.name]: event.currentTarget.value
      })
    }
  },

  validate(event) {
    this.setState({showError: true});
    this.props.schema && this.props.schema.validateOne({
      [this.props.name]: event.currentTarget.value
    }, this.props.name);
  },

  render() {

    var showErrorState = () => (
      this.state.showError && this.data.error
    );

    return (
      <div
        className={classNames(this.props.className, {
          error: showErrorState()
        })}>

        {this.props.label ? (
          <label>{this.props.label}</label>
        ) : null}

        <input
          placeholder={this.props.placeholder}
          onFocus={this.hideError}
          onBlur={this.validate}
          onChange={this.onChange}
          type={this.props.type || 'text'}
          name={this.props.name}
        />

        {this.props.hint ? (
          <span className="hint">{this.props.hint}</span>
        ) : null}

        {showErrorState() && this.props.errorTooltip ? (
            <div className="ui pointing red basic label">
              {this.data.error}
            </div>
          ) : null}

        {this.props.children}

      </div>
    );
  }
});