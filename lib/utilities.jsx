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
 * source: https://gist.github.com/penguinboy/762197
 */
export function flattenObject(ob) {
  var toReturn = {}

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue

    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i])
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue

        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}