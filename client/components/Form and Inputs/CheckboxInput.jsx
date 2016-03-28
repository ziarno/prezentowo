import React from 'react'
import {ValidatedInput, RefreshOnLocaleChange} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

CheckboxInput = class CheckboxInput extends ValidatedInput {

  constructor() {
    super()
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.reset = this.reset.bind(this)
  }
  
  getValue() {
    return $(this.refs.checkbox).checkbox('is checked')
  }

  setValue(value) {
    $(this.refs.checkbox).checkbox(
      value ? 'set checked' : 'set unchecked'
    )
  }

  reset() {
    this.setValue(this.props.checked)
  }

  componentDidMount() {
    super.componentDidMount()
    $(this.refs.checkbox).checkbox({
      onChecked: () => this.onChange(true),
      onUnchecked: () => this.onChange(false)
    })
  }

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
    )
  }
}

CheckboxInput.propTypes = {
  checked: React.PropTypes.bool,
  label: React.PropTypes.string
}

reactMixin(CheckboxInput.prototype, RefreshOnLocaleChange)