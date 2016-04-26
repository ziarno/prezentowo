import React from 'react'
import ReactDOM from 'react-dom'
import {ScrollableComponent} from '../../../lib/Mixins'
import {whichTransitionEvent} from '../../../lib/utilities'

Sidebar = class Sidebar extends ScrollableComponent {

  constructor() {
    super()
    this.toggleVisibility = this.toggleVisibility.bind(this)
    this.afterVisibilityChange = this.afterVisibilityChange.bind(this)
    this.transitionEndEventName = whichTransitionEvent()
  }

  toggleVisibility(isVisible) {
    var visible = _.isBoolean(isVisible) ?
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

  componentWillReceiveProps(newProps) {
    super.componentWillReceiveProps(newProps)
    this.isScrollable = newProps.isVisible
  }

  afterVisibilityChange(event) {
    if (event.propertyName === 'left') {
      this.props.onAfterVisibilityChange.apply(this, arguments)
    }
  }

  componentDidMount() {
    super.componentDidMount()
    this.isScrollable = this.props.isVisible
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

    return (
      <div
        id="sidebar"
        className={classNames({
          visible: this.props.isVisible
        })}>
        <div
          onClick={this.toggleVisibility}
          className="sidebar-controller ui compact icon button">
          <i className="left chevron icon" />
        </div>
        <div
          ref="scrollContainer"
          className="sidebar-wrapper shadow">
          {this.props.children}
        </div>
      </div>
    )
  }

}

Sidebar.propTypes = {
  isVisible: React.PropTypes.bool,
  onVisibilityChange: React.PropTypes.func,
  onAfterVisibilityChange: React.PropTypes.func
}