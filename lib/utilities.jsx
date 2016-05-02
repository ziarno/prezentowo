import React from 'react'
import _ from 'underscore'

String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

Array.prototype.moveToTop = function (findFunction) {
  var index = _.findIndex(this, findFunction)

  return index > -1 && this.unshift(
    this.splice(index, 1)[0]
  )
}

export function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

/**
 * Flatten javascript objects into a single-depth object
 * source: https://gist.github.com/fantactuka/4989737
 *
 * ex.
 *  {x: {a: 5, b: {y: 7}} c: 3} =>
 *  {x.a: 5, x.b.y: 7, c: 3}
 *
 * Note: does not alter arrays or dates
 */
export function flattenObject(object, target, prefix) {
  prefix = prefix || '';

  return _(object).inject(function(result, value, key) {
    if (_.isObject(value) &&
        !_.isArray(value) &&
        !_.isDate(value)) {
      flattenObject(value, result, prefix + key + '.');
    } else {
      result[prefix + key] = value;
    }

    return result;
  }, target || {});
}

/**
 * Opposite to flatten object
 * source: https://gist.github.com/fantactuka/4989737
 *
 * ex.
 *  {x.a: 5, x.b.y: 7, c: 3} =>
 *  {x: {a: 5, b: {y: 7}} c: 3}
 */
export function unflattenObject(object) {
  return _(object).inject(function(result, value, keys) {
    var current = result,
      partitions = keys.split('.'),
      limit = partitions.length - 1

    _(partitions).each(function(key, index) {
      current = current[key] = (index == limit ? value : (current[key] || {}))
    })

    return result
  }, {})
}

export function getAvatarImages(gender) {
  var fileLetterName = gender === 'female' ? 'f' : 'm'
  return _.range(12).map((index) => (
    `/images/avatars/${fileLetterName}${index + 1}.png`
  ))
}

export function getPresentImages() {
  return _.range(20).map((index) => {
    return {
      small: `/images/presents/p${index + 1}-150px.png`,
      large: `/images/presents/p${index + 1}-600px.png`
    }
  })
}

/**
 * returns the name of the css
 * transition end event depending on
 * the browser
 * source: https://davidwalsh.name/css-animation-callback
 */
export function whichTransitionEvent() {
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(t in transitions){
    if( el.style[t] !== undefined ){
      return transitions[t];
    }
  }
}

