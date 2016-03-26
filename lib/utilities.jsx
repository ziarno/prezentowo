import _ from 'underscore'

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

Array.prototype.moveToTop = function (findFunction) {
  return this.unshift(
    this.splice(
      _.findIndex(this, findFunction), 1
    )[0]
  )
}