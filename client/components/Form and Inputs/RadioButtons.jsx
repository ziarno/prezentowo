import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { $ } from 'meteor/jquery'
import { classNames } from 'meteor/maxharris9:classnames'
import { ValidatedInput } from '../../../lib/Mixins'

RadioButtons = class RadioButtons extends ValidatedInput {

  constructor(props) {
    super(props)
    this.state = {
      value: null
    }
    this.onClick = this.onClick.bind(this)
    this.setActive = this.setActive.bind(this)
  }

  getValue() {
    return this.state.value
  }

  setValue(value) {
    this.setState({value})
  }

  setActive(value) {
    const $this = $(ReactDOM.findDOMNode(this))

    $this
      .find('[data-value]')
      .removeClass('active')
      .parent()
      .find(`[data-value=${value}]`)
      .addClass('active')
  }

  onClick({target}) {
    let $target = $(target)
    const $this = $(ReactDOM.findDOMNode(this))
    let value = $target.attr('data-value')

    while (!value && !$target.is($this)) {
      $target = $target.parent()
      value = $target.attr('data-value')
    }

    if (!_.isUndefined(value)) {
      this.setState({value})
      this.onChange(value)
      this.validate(value)
    }
  }

  componentDidMount() {
    super.componentDidMount()
    this.setActive(this.state.value)
  }

  componentDidUpdate() {
    this.setActive(this.state.value)
  }

  render() {
    const {
      label,
      className,
      vertical,
      children
    } = this.props

    return (
      <div
        className={classNames('ui compact buttons', className, {
          vertical,
          error: this.shouldShowError()
        })}
        onClick={this.onClick}
      >

        {label ? (
          <label>
            <T>{label}</T>
          </label>
        ) : null}

        {children}

      </div>
    )
  }

}

RadioButtons.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  vertical: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}
