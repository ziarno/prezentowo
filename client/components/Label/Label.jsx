import React from 'react'
import {Tooltips} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

Label = class Label extends React.Component {

  constructor() {
    super()
    this.getTooltips = this.getTooltips.bind(this)
  }

  getTooltips() {
    if (!this.props.tooltip) {
      return
    }

    return {
      label: this.props.tooltip
    }
  }

  render() {
    return (
      <div
        ref="label"
        className={classNames('ui label', this.props.className)}>
        {this.props.children}
      </div>
    )
  }

}

reactMixin(Label.prototype, Tooltips)

Label.propTypes = {
  className: React.PropTypes.string,
  tooltip: React.PropTypes.object
}