import React from 'react'
import ReactDOM from 'react-dom'

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

    var currentRibbonHeight = $(this.refs.ribbon).outerHeight()
    var evenRibbonHeight = currentRibbonHeight +
      (currentRibbonHeight % 2)
    var endingSize = evenRibbonHeight * Math.sqrt(2)
    var endingDistance = evenRibbonHeight - (endingSize / 2)

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

    var ActualRibbon = (
      <div
        ref="ribbon"
        className={classNames('ribbon', this.props.color, {
          small: this.props.small,
          'white-stitches': this.props.whiteStiches,
          'with-endings': this.props.withEndings
        })}>
        <div className="ribbon-stitches
          ribbon-stitches--top"></div>
        <div className="ribbon-content">
          {this.props.children}
        </div>
        <div className="ribbon-stitches
          ribbon-stitches--bottom"></div>
      </div>
    )

    return this.props.rightFlatEnding ? (
      <div
        ref="ribbonWrapper"
        className={classNames('ribbon-wrapper', this.props.color)}>
        {ActualRibbon}
        <div
          ref="rightEndingTop"
          className="right-ending right-ending--top">
        </div>
        <div
          ref="rightEndingBottom"
          className="right-ending right-ending--bottom">
        </div>
      </div>
    ) : ActualRibbon
  }
}

Ribbon.propTypes = {
  color: React.PropTypes.string,
  small: React.PropTypes.bool,
  whiteStiches: React.PropTypes.bool,
  withEndings: React.PropTypes.bool,
  rightFlatEnding: React.PropTypes.bool
}