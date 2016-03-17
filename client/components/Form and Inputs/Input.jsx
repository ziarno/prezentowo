import {InputValidation} from '../../../lib/Mixins';

Input = React.createClass({

  mixins: [InputValidation],

  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    className: React.PropTypes.string,
    type: React.PropTypes.string,
    hint: React.PropTypes.string,
    rows: React.PropTypes.number,
    placeholder: React.PropTypes.string
  },

  reset() {},

  getValue() {
    return this.refs.input.value;
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

        <div className="ui input">
          {this.props.type === 'textarea' ? (
            <textarea
              ref="input"
              placeholder={this.props.placeholder}
              onFocus={this.hideError}
              onBlur={(e) => this.validate(e.currentTarget.value)}
              onChange={(e) => this.onChange(e.currentTarget.value)}
              name={this.props.name}
              rows={this.props.rows || 8}
            />
          ): (
            <input
              ref="input"
              placeholder={this.props.placeholder}
              onFocus={this.hideError}
              onBlur={(e) => this.validate(e.currentTarget.value)}
              onChange={(e) => this.onChange(e.currentTarget.value)}
              type={this.props.type || 'text'}
              name={this.props.name}
            />
          )}
        </div>

        {this.props.hint ? (
          <span className="hint">{this.props.hint}</span>
        ) : null}

        {this.props.children}

      </div>
    );
  }
});