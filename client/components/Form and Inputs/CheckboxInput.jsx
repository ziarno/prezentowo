import {InputValidation, RefreshOnLocaleChange} from '../../../lib/Mixins';

CheckboxInput = React.createClass({

  mixins: [InputValidation, RefreshOnLocaleChange],

  propTypes: {
    checked: React.PropTypes.bool,
    label: React.PropTypes.string
  },

  getValue() {
    return $(this.refs.checkbox).checkbox('is checked');
  },

  setValue(value) {
    $(this.refs.checkbox).checkbox(
      value ? 'set checked' : 'set unchecked'
    );
  },

  reset() {
    this.setValue(this.props.checked);
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
          {_i18n.__(this.props.label)}
        </label>

      </div>
    );
  }
});