import React, { PropTypes } from 'react'
import reactMixin from 'react-mixin'
import { _i18n } from 'meteor/universe:i18n'
import { classNames } from 'meteor/maxharris9:classnames'
import {
  ValidatedInput,
  RefreshOnLocaleChange
} from '../../../lib/Mixins'

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
    const {
      placeholder,
      name,
      rows,
      type,
      label,
      button,
      className,
      size,
      hint,
      children
    } = this.props
    const inputProps = {
      ref: 'input',
      placeholder: _i18n.__(placeholder),
      onFocus: this.hideError,
      onBlur: e => this.validate(e.currentTarget.value),
      onChange: e => this.onInputChange(e.currentTarget.value),
      name,
      rows: rows || 8,
      type: type || 'text',
      disabled: this.isDisabled()
    }

    return (
      <div
        className={classNames('ui field', className, {
          error: this.shouldShowError()
        })}
      >

        {label ? (
          <label>
            <T>{label}</T>
          </label>
        ) : null}

        <div
          className={classNames('ui input', size, {
            action: button
          })}
        >
          {type === 'textarea' ? (
            <textarea
              {...inputProps}
            />
          ) : (
            <input
              autoComplete="off"
              {...inputProps}
            />
          )}
          {button || null}
        </div>

        {hint ? (
          <span className="hint">{_i18n.__(hint)}</span>
        ) : null}

        {children}

      </div>
    )
  }
}

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  hint: PropTypes.string,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  size: PropTypes.string,
  button: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}

reactMixin(Input.prototype, RefreshOnLocaleChange)
