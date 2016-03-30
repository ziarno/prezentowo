import React from 'react'

$.fn.scrollTo = function (target, settings = {}) {
  return this.each(function () {
    var $this = $(this)
    var $target = $this.find(target)
    var scrollTop = $target[0].offsetTop
    var offsetParentEl = $target[0].offsetParent
    var offset = 0

    while (offsetParentEl && offsetParentEl !== this) {
      scrollTop += offsetParentEl.offsetTop
      offsetParentEl = offsetParentEl.offsetParent
    }

    if (_.isNumber(settings.offset)) {
      offset = parseInt(settings.offset, 10)
    }
    if (settings.offset === 'middle') {
      offset = - ($this[0].offsetHeight - $target[0].offsetHeight) / 2
    }

    scrollTop += offset

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