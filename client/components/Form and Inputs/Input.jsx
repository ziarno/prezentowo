import React from 'react'
import {ValidatedInput, RefreshOnLocaleChange} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

Input = class Input extends ValidatedInput {

  constructor(props) {
    super(props)
    this.reset = this.reset.bind(this)
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  reset() {
    this.setValue(null)
  }

  getValue() {
    return this.refs.input.value
  }

  setValue(value) {
    this.refs.input.value = value || null
  }

  onInputChange(value) {
    //if input is in error state then we want to get rid of it as soon as the user types in correct input
    if (this.state.hasError) {
      //validate silently so if input still has error, showError won't be set
      this.validate(value, true)
    }
    this.onChange(value)
  }

  render() {

    return (
      <div
        className={classNames('ui field', this.props.className, {
          error: this.shouldShowError()
        })}>

        {this.props.label ? (
          <label>
            <T>{this.props.label}</T>
          </label>
        ) : null}

        <div className="ui input">
          {this.props.type === 'textarea' ? (
            <textarea
              ref="input"
              placeholder={_i18n.__(this.props.placeholder)}
              onFocus={this.hideError}
              onBlur={(e) => this.validate(e.currentTarget.value)}
              onChange={(e) => this.onInputChange(e.currentTarget.value)}
              name={this.props.name}
              rows={this.props.rows || 8}
            />
          ) : (
            <input
              ref="input"
              placeholder={_i18n.__(this.props.placeholder)}
              onFocus={this.hideError}
              onBlur={(e) => this.validate(e.currentTarget.value)}
              onChange={(e) => this.onInputChange(e.currentTarget.value)}
              type={this.props.type || 'text'}
              name={this.props.name}
            />
          )}
        </div>

        {this.props.hint ? (
          <span className="hint">{_i18n.__(this.props.hint)}</span>
        ) : null}

        {this.props.children}

      </div>
    )
  }
}

Input.propTypes = {
  label: React.PropTypes.string,
  className: React.PropTypes.string,
  type: React.PropTypes.string,
  hint: React.PropTypes.string,
  rows: React.PropTypes.number,
  placeholder: React.PropTypes.string
}

reactMixin(Input.prototype, RefreshOnLocaleChange)