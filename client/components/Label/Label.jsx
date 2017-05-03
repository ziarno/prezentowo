import React from 'react'
import _ from 'underscore'
import { _i18n } from 'meteor/universe:i18n'
import reactMixin from 'react-mixin'
import { classNames } from 'meteor/maxharris9:classnames'
import { Tooltips } from '../../../lib/Mixins'

Label = class Label extends React.Component {

  constructor() {
    super()
    this.getTooltips = this.getTooltips.bind(this)
  }

  getTooltips() {
    const { tooltip } = this.props
    let tooltipSettings

    if (!tooltip) {
      return
    }

    tooltipSettings = _.isString(tooltip) ?
      { content: tooltip } : tooltip

    tooltipSettings.content =
      _i18n.__(tooltipSettings.content)

    return {
      label: tooltipSettings
    }
  }

  render() {
    const {
      className,
      children
    } = this.props
    return (
      <div
        ref="label"
        className={classNames('ui label', className)}
      >
        {children}
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
