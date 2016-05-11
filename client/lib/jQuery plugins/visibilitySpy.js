/**
 * Created by jarno on 11.05.2016.
 */

(function ($) {

  var existingSpies = []

  function isElementInView(element) {
    if (!element) {
      return false
    }

    var rect = element.getBoundingClientRect()
    var top = rect.top
    var bottom = rect.bottom

    return top >= (this.containerTop + this.offsetTop) &&
      bottom <= (this.containerBottom + this.offsetBottom)
  }

  function setContainerSize() {
    var containerRect = this.scrollContainer.getBoundingClientRect()
    this.containerTop = containerRect.top
    this.containerBottom = containerRect.bottom
  }

  function checkVisibility() {
    var visibleElements = []
    this.spyOnElements.each((index, element) => {
      if (this.isElementInView(element)) {
        visibleElements.push(element)
      }
    })
    this.onChange(visibleElements)
  }

  $.fn.visibilitySpy = function ({
    spyOn,
    onChange = function() {},
    throttle = 1000,
    offsetTop = 0,
    offsetBottom = 0,
    action
    }) {

    var existingSpy = _.find(existingSpies, ({scrollContainer}) => (
      this[0] === scrollContainer
    ))
    var scrollContainer = this[0]
    var spy = {
      offsetTop,
      offsetBottom,
      onChange,
      scrollContainer
    }

    if (!scrollContainer) {
      return
    }

    if (action === 'stop' && existingSpy) {
      let {
        onScroll,
        setContainerSize,
        scrollContainer
        } = existingSpy
      let index = existingSpies.indexOf(existingSpy)
      $(scrollContainer)
        .off('scroll', onScroll)
      $(window)
        .off('resize', setContainerSize)
      existingSpies.splice(index, 1)
      return
    }

    if (existingSpy) {
      existingSpy.setContainerSize()
      return existingSpy.spyOnElements = this.find(spyOn)
    }

    spy.isElementInView = isElementInView.bind(spy)
    spy.setContainerSize = setContainerSize.bind(spy)
    spy.spyOnElements = this.find(spyOn)
    spy.onScroll = _.throttle(
      checkVisibility.bind(spy),
      throttle,
      {leading: false}
    )

    $(spy.scrollContainer)
      .on('scroll', spy.onScroll)
    $(window)
      .on('resize', spy.setContainerSize)
    spy.setContainerSize()
    spy.onScroll()

    existingSpies.push(spy)
  }

})(jQuery)