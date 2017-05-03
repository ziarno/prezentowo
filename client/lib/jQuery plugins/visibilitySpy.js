import { $ } from 'meteor/jquery'
import _ from 'underscore'

const existingSpies = []

function isElementInView(element) {
  if (!element) {
    return false
  }

  const rect = element.getBoundingClientRect()
  const { top, bottom } = rect

  return top >= (this.containerTop + this.offsetTop) &&
    bottom <= (this.containerBottom + this.offsetBottom)
}

function setContainerSize() {
  const { top, bottom } = this.scrollContainer.getBoundingClientRect()
  this.containerTop = top
  this.containerBottom = bottom
}

function checkVisibility() {
  const visibleElements = []
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

  const existingSpy = _.find(existingSpies, ({scrollContainer}) => (
    this[0] === scrollContainer
  ))
  const scrollContainer = this[0]
  const spy = {
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
    { leading: false }
  )

  $(spy.scrollContainer)
    .on('scroll', spy.onScroll)
  $(window)
    .on('resize', spy.setContainerSize)
  spy.setContainerSize()
  spy.onScroll()

  existingSpies.push(spy)
}
