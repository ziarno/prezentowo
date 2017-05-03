import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { classNames } from 'meteor/maxharris9:classnames'

Ribbon = class Ribbon extends React.Component  {

  constructor() {
    super()
    this.calculateRightEndingPosition =
      this.calculateRightEndingPosition.bind(this)
    this.throttledCalculatePosition =
      _.throttle(this.calculateRightEndingPosition, 500)
  }

  calculateRightEndingPosition() {
    //the right flat ending are 2 gradient squares,
    // which sizes and positions must be calculated in JS

    this.resetCalculations()

    if (!this.props.rightFlatEnding) {
      return
    }

    const currentRibbonHeight = $(this.refs.ribbon).outerHeight()
    const evenRibbonHeight = currentRibbonHeight +
      (currentRibbonHeight % 2)
    const endingSize = evenRibbonHeight * Math.sqrt(2)
    const endingDistance = evenRibbonHeight - (endingSize / 2)

    $(this.refs.rightEndingTop).css({
      height: endingSize,
      width: endingSize,
      right: endingDistance,
      bottom: endingDistance
    })
    $(this.refs.rightEndingBottom).css({
      height: endingSize,
      width: endingSize,
      right: endingDistance,
      top: endingDistance
    })
    $(this.refs.ribbonWrapper).css({
      paddingRight: evenRibbonHeight / 2,
      height: evenRibbonHeight
    })
  }

  resetCalculations() {
    $(ReactDOM.findDOMNode(this))
      .attr('style', '')
      .find('*')
      .attr('style', '')
  }

  componentDidMount() {
    this.calculateRightEndingPosition()
    if (this.props.rightFlatEnding) {
      $(window).on('resize', this.throttledCalculatePosition)
    }
  }

  componentDidUpdate() {
    this.calculateRightEndingPosition()
  }

  componentWillUnmount() {
    $(window).off('resize', this.throttledCalculatePosition)
  }

  render() {
    const {
      onMouseEnter,
      onMouseLeave,
      onClick,
      color,
      className,
      small,
      whiteStitches,
      withEndings,
      children,
      rightFlatEnding,
      wrapperClassName,
    } = this.props
    const ActualRibbon = (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        ref="ribbon"
        className={classNames(
          'ribbon',
          color,
          className,
          {
            small,
            'white-stitches': whiteStitches,
            'with-endings': withEndings
          }
        )}
      >
        <div className="ribbon-stitches ribbon-stitches--top">
        </div>
        <div className="ribbon-content">
          {children}
        </div>
        <div className="ribbon-stitches ribbon-stitches--bottom">
        </div>
      </div>
    )

    return rightFlatEnding ? (
      <div
        ref="ribbonWrapper"
        className={classNames(
          'ribbon-wrapper',
          wrapperClassName,
          color
        )}
      >
        {ActualRibbon}
        <div
          ref="rightEndingTop"
          className="right-ending right-ending--top"
        >
        </div>
        <div
          ref="rightEndingBottom"
          className="right-ending right-ending--bottom"
        >
        </div>
      </div>
    ) : ActualRibbon
  }
}

Ribbon.propTypes = {
  className: React.PropTypes.string,
  wrapperClassName: React.PropTypes.string,
  color: React.PropTypes.string,
  small: React.PropTypes.bool,
  whiteStitches: React.PropTypes.bool,
  withEndings: React.PropTypes.bool,
  rightFlatEnding: React.PropTypes.bool,
  onMouseLeave: React.PropTypes.func,
  onMouseEnter: React.PropTypes.func,
  onClick: React.PropTypes.func
}
