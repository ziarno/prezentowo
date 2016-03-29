import React from 'react'
import {ScrollableComponent} from '../../../lib/Mixins'

Sidebar = class Sidebar extends ScrollableComponent {

  constructor({initiallyVisible}) {
    super()
    this.state = {
      visible: initiallyVisible
    }
    this.toggleVisibility = this.toggleVisibility.bind(this)
  }

  toggleVisibility() {
    var visible = !this.state.visible

    this.isScrollable = visible
    this.setState({visible})
    if (_.isFunction(this.props.onVisibilityChange)) {
      this.props.onVisibilityChange(visible)
    }
  }

  getScrollToOptions() {
    return {
      offset: 'middle'
    }
  }

  render() {

    return (
      <div
        id="sidebar"
        className={classNames({
          visible: this.state.visible
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
  initiallyVisible: React.PropTypes.bool,
  onVisibilityChange: React.PropTypes.func
}