import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { ScrollableComponent } from '../../../lib/Mixins'
import { whichTransitionEvent } from '../../../lib/utilities'

Sidebar = class Sidebar extends ScrollableComponent {

  constructor() {
    super()
    this.toggleVisibility = this.toggleVisibility.bind(this)
    this.afterVisibilityChange = this.afterVisibilityChange.bind(this)
    this.transitionEndEventName = whichTransitionEvent()
  }

  toggleVisibility(isVisible) {
    const visible = _.isBoolean(isVisible) ?
      isVisible :
      !this.props.isVisible

    if (_.isFunction(this.props.onVisibilityChange)) {
      this.props.onVisibilityChange(visible)
    }
  }

  getScrollToOptions() {
    return {
      offset: 'middle'
    }
  }

  isScrollable() {
    return this.props.isVisible
  }

  componentWillReceiveProps(newProps) {
    super.componentWillReceiveProps(newProps)
  }

  afterVisibilityChange(event) {
    if (event.propertyName === 'left') {
      this.props.onAfterVisibilityChange.apply(this, arguments)
    }
  }

  componentDidMount() {
    super.componentDidMount()
    if (_.isFunction(this.props.onAfterVisibilityChange)) {
      ReactDOM.findDOMNode(this)
        .addEventListener(
          this.transitionEndEventName,
          this.afterVisibilityChange
        )
    }
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this)
      .removeEventListener(
        this.transitionEndEventName,
        this.afterVisibilityChange
      )
  }

  render() {
    const {
      isVisible,
      children
    } = this.props

    return (
      <div
        id="sidebar"
        className={classNames({
          visible: isVisible
        })}
      >
        <div
          onClick={this.toggleVisibility}
          className="sidebar-controller ui compact icon button"
        >
          <i className="left chevron icon" />
        </div>
        <div
          ref="scrollContainer"
          className="sidebar-wrapper shadow"
        >
          {children}
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  isVisible: PropTypes.bool,
  onVisibilityChange: PropTypes.func,
  onAfterVisibilityChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}
