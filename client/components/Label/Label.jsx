import React from 'react'
import {Tooltips} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

Label = class Label extends React.Component {

  constructor() {
    super()
    this.getTooltips = this.getTooltips.bind(this)
  }

  getTooltips() {
    var {tooltip} = this.props
    var tooltipSettings

    if (!tooltip) {
      return
    }

    tooltipSettings = _.isString(tooltip) ?
      {content: tooltip} : tooltip

    tooltipSettings.content =
      _i18n.__(tooltipSettings.content)

    return {
      label: tooltipSettings
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
  tooltip: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.string
  ])
}