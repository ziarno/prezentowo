Input = React.createClass({

  mixins: [InputValidationMixin],

  propTypes: {
    label: React.PropTypes.string,
    hint: React.PropTypes.string,
    placeholder: React.PropTypes.string
  },

  render() {

    return (
      <div
        className={classNames('ui field', this.props.className, {
          error: this.shouldShowError()
        })}>

        {this.props.label ? (
          <label>{this.props.label}</label>
        ) : null}

        <input
          placeholder={this.props.placeholder}
          onFocus={this.hideError}
          onBlur={(e) => this.validate(e.currentTarget.value)}
          onChange={(e) => this.onChange(e.currentTarget.value)}
          type={this.props.type || 'text'}
          name={this.props.name}
        />

        {this.props.hint ? (
          <span className="hint">{this.props.hint}</span>
        ) : null}

        {this.props.children}

      </div>
    );
  }
});