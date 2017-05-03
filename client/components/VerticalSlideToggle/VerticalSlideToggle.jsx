import React, { Component, PropTypes } from 'react'
import _ from 'underscore'
import { classNames } from 'meteor/maxharris9:classnames'

VerticalSlideToggle = class VerticalSlideToggle extends Component {

  constructor() {
    super()
    this.state = {
      visible: true,
      maxHeight: false
    }
    this.setHeight = this.setHeight.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  setHeight(visible = this.state.visible) {
    this.setState({
      visible,
      maxHeight: visible ? this.refs.slideToggle.scrollHeight : 0
    })
  }

  toggle() {
    const {
      onToggle
    } = this.props
    this.setHeight(!this.state.visible)
    if (_.isFunction(onToggle)) {
      onToggle(!this.state.visible)
    }
  }

  componentDidUpdate(prevProps, { maxHeight }) {
    if (maxHeight !== 0 &&
      maxHeight !== this.refs.slideToggle.scrollHeight) {
      this.setHeight()
    }
  }

  componentDidMount() {
    this.setHeight()
  }

  render() {
    const {
      id,
      className,
      children
    } = this.props
    const {
      visible,
      maxHeight
    } = this.state
    const style = {
      opacity: visible ? 1 : 0.4
    }

    if (maxHeight !== false) {
      style.maxHeight = maxHeight
    }

    return (
      <div
        id={id}
        ref="slideToggle"
        style={style}
        className={classNames('vertical-slide-toggle', className)}
      >
        {children}
      </div>
    )
  }
}

VerticalSlideToggle.propTypes = {
  onToggle: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string
}
