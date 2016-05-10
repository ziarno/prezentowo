import React from 'react'

/**
 * TOOLTIPS MIXIN
 *
 * There are no 'tooltips' in semantic ui, only popups.
 * Tooltips = small popups.
 *
 * Requires:
 * getTooltips() method - must return an object:
 * {
 *  [refName]: {tooltipConfig},
 *  ...
 * }
 * Note: Add refNames to components!
 */
var Tooltips = {

  defaultConfig: {
    variation: 'inverted tiny',
    position: 'bottom center',
    delay: {
      show: 300,
      hide: 0
    },
    duration: 100
  },

  componentWillMount() {
    this.setTooltips = this.setTooltips.bind(this)
    this.invokeTooltipsWith = this.invokeTooltipsWith.bind(this)
    this.hideTooltips = this.hideTooltips.bind(this)
  },

  componentDidMount() {
    this.setTooltips()
    _i18n.onChangeLocale(this.setTooltips)
  },

  componentDidUpdate() {
    this.setTooltips()
  },

  componentWillUnmount() {
    this.invokeTooltipsWith('destroy')
    _i18n.offChangeLocale(this.setTooltips)
  },

  setTooltips() {
    this.invokeTooltipsWith((tooltipConfig) => ({
      ...this.defaultConfig,
      ...tooltipConfig
    }))
  },

  hideTooltips() {
    this.invokeTooltipsWith('hide')
  },

  invokeTooltipsWith(action) {
    var tooltips = _.isFunction(this.getTooltips) ?
      this.getTooltips() : {}

    _.each(tooltips, (tooltipConfig, key) => {
      var tooltipAction = _.isFunction(action) ?
        action(tooltipConfig, key) : action

      $(this.refs[key]).popup(tooltipAction)
    }, this)
  }

}

export default Tooltips