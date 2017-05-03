import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { $ } from 'meteor/jquery'
import { _i18n } from 'meteor/universe:i18n'
import { classNames } from 'meteor/maxharris9:classnames'
import { ValidatedInput } from '../../../lib/Mixins'

SelectInput = class SelectInput extends ValidatedInput {

  constructor(props) {
    super(props)
    this.state = _.extend(this.state, {
      isSelectedByUser: false
    })
    this.setValue = this.setValue.bind(this)
    this.selectDefault = this.selectDefault.bind(this)
    this.getValue = this.getValue.bind(this)
    this.reset = this.reset.bind(this)
  }

  setValue(value) {
    //note: item selection must be done manually with react, because semantic does DOM manipulation on its own otherwise and it ends up cloning elements with the same reactid
    const $dropdown = $(this.refs.dropdown)
    const $node = $dropdown.dropdown('get item', value)
    let $nodeCloned

    if (!value || !($node instanceof jQuery)) {
      return
    }

    $nodeCloned = $($.clone($node[0]))

    $nodeCloned
      .find('*')
      .removeAttr('data-reactid')
    $(this.refs.placeholder).removeClass('default')

    $node
      .addClass('active selected')
      .siblings()
      .removeClass('active selected')
    ReactDOM.unmountComponentAtNode(this.refs.placeholder)
    ReactDOM.render(
      <div dangerouslySetInnerHTML={{__html: $nodeCloned.html()}} />,
      this.refs.placeholder
    )
    $dropdown.dropdown('set value', value)
  }

  selectDefault(value) {
    if (value &&
      !this.state.isSelectedByUser &&
      !this.getValue()) {
      this.setValue(value)
    }
  }

  getValue() {
    const value = $(this.refs.dropdown).dropdown('get value')
    return _.isString(value) && value
  }

  reset() {
    $(this.refs.dropdown).dropdown('clear')
    this.setState({
      isSelectedByUser: false
    })
    this.selectDefault(this.props.selectDefault)
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  componentWillReceiveProps({selectDefault}) {
    this.selectDefault(selectDefault)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    ReactDOM.unmountComponentAtNode(this.refs.placeholder)
  }

  componentDidMount() {
    super.componentDidMount()
    const $dropdown = $(this.refs.dropdown)

    function scrollCurrentIntoView() {
      const value = $dropdown.dropdown('get value')
      const $item = $dropdown.dropdown('get item', value)

      if ($item && _.isFunction($item[0].scrollIntoViewIfNeeded)) {
        setTimeout(() => {
          $item[0].scrollIntoViewIfNeeded(true)
        }, 300)
      }
    }

    $dropdown.dropdown({
      action: (nodeString, value) => {
        $dropdown.dropdown('hide')
        this.setState({isSelectedByUser: true}) // note: setState before setValue, because causes am update after setting a value -> which causes the value to be set as default
        this.setValue(value)
      },
      onChange: (value) => {
        this.validate(value)
        this.onChange(value)
      },
      onShow: () => {
        scrollCurrentIntoView()
        this.hideError()
      },
      onHide: () => this.showError()
    })

    this.selectDefault(this.props.selectDefault)
  }

  render() {
    const {
      className,
      inline,
      placeholder,
      children
    } = this.props
    return (
      <div
        ref="dropdown"
        className={classNames('ui dropdown', className, {
          'fluid selection': !inline,
          inline,
          error: this.shouldShowError(),
          disabled: this.isDisabled()
        })}
      >

        <div
          ref="placeholder"
          className="default text">
          {_i18n.__(placeholder)}
        </div>

        <i className="dropdown icon" />

        <div className="menu">
          {children}
        </div>

      </div>
    )
  }
}

SelectInput.propTypes = {
  inline: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  selectDefault: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}
