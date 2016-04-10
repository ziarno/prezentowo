import React from 'react'
import {ScrollableComponent} from '../../../lib/Mixins'

Sidebar = class Sidebar extends ScrollableComponent {

  constructor() {
    super()
    this.toggleVisibility = this.toggleVisibility.bind(this)
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

  componentDidMount() {
    super.componentDidMount()
    this.isScrollable = this.props.isVisible
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
  onVisibilityChange: React.PropTypes.func
}