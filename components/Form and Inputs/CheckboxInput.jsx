CheckboxInput = React.createClass({

  mixins: [InputValidationMixin],

  propTypes: {
    label: React.PropTypes.string
  },

  getValue() {
    return $(this.refs.checkbox).checkbox('is checked');
  },

  reset() {
    $(this.refs.checkbox).checkbox(
      this.props.checked ? 'set checked' : 'set unchecked'
    );
  },

  componentDidMount() {
    $(this.refs.checkbox).checkbox({
      onChecked: () => this.onChange(true),
      onUnchecked: () => this.onChange(false)
    });
  },

  render() {
    return (
      <div
        ref="checkbox"
        className={classNames('ui checkbox', this.props.className, {
          error: this.shouldShowError()
        })}>

        <input
          type="checkbox"
          tabIndex="0"
          defaultChecked={this.props.checked}
          className="hidden"
        />
        <label>
          {this.props.label}
        </label>

      </div>
    );
  }
});