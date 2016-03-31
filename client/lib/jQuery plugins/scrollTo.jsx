import React from 'react'

$.fn.scrollTo = function (targetSelector, settings = {}) {
  return this.each(function () {
    var $this = $(this)
    var $target = $this.find(targetSelector)
    var target = $target[0]
    var offset = 0
    var scrollTop
    var offsetParentEl

    if (!target) {
      return
    }

    offsetParentEl = target.offsetParent

    while (offsetParentEl && offsetParentEl !== this) {
      offset += offsetParentEl.offsetTop
      offsetParentEl = offsetParentEl.offsetParent
    }

    if (_.isNumber(settings.offset)) {
      offset +=parseInt(settings.offset, 10)
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