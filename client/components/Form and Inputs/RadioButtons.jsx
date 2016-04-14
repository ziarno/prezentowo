import React from 'react'
import ReactDOM from 'react-dom'
import {ValidatedInput, RefreshOnLocaleChange} from '../../../lib/Mixins'

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
    var $this = $(ReactDOM.findDOMNode(this))

    $this
      .find('[data-value]')
      .removeClass('active')
      .parent()
      .find(`[data-value=${value}]`)
      .addClass('active')
  }

  onClick({target}) {
    var $target = $(target)
    var $this = $(ReactDOM.findDOMNode(this))
    var value = $target.attr('data-value')

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

    var Buttons = this.props.buttons && this.props.buttons.map((button) => (
      <button
        key={button.value}
        type="button"
        disabled={this.isDisabled()}
        onClick={() => this.setState({value: button.value})}
        className={classNames('ui icon button', button.className, {
          active: this.state.value === button.value
        })}>
        <T>{button.text}</T>
        <i className={`${button.icon} icon`}></i>
      </button>
    ))

    return (
      <div
        className={classNames('ui compact buttons', this.props.className, {
          vertical: this.props.vertical,
          error: this.shouldShowError()
        })}
        onClick={this.onClick}>

        {this.props.label ? (
          <label>
            <T>{this.props.label}</T>
          </label>
        ) : null}

        {this.props.children}

      </div>
    )
  }

}

RadioButtons.propTypes = {
  label: React.PropTypes.string,
  className: React.PropTypes.string,
  vertical: React.PropTypes.string
}