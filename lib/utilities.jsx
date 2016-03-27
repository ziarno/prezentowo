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