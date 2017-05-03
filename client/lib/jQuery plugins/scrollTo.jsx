import React from 'react'
import { $ } from 'meteor/jquery'
import _ from 'underscore'

$.fn.scrollTo = function (targetSelector, settings = {}) {
  return this.each(function () {
    const $this = $(this)
    const $target = $this.find(targetSelector)
    const target = $target[0]
    let offset = 0
    let scrollTop
    let offsetParentEl

    if (!target) {
      return
    }

    offsetParentEl = target.offsetParent

    while (offsetParentEl && offsetParentEl !== this) {
      offset += offsetParentEl.offsetTop
      offsetParentEl = offsetParentEl.offsetParent
    }

    if (_.isNumber(settings.offset)) {
      offset += parseInt(settings.offset, 10)
    }
    if (settings.offset === 'middle') {
      offset -= (this.offsetHeight - target.offsetHeight) / 2
    }

    scrollTop = target.offsetTop + offset

    $this.animate({
      scrollTop
    }, {
      queue: false,
      duration: 1000,
      ...settings
    })
    .promise()
    .then(function () {
      if (_.isFunction(settings.onAfter)) {
        settings.onAfter.call(this, $target)
      }
    })
  })
}
