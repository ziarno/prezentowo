export function attachWaves() {
  Waves.attach('.button:not(.no-waves)', ['waves-button'])
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

Array.prototype.moveToTop = function (findFunction) {
  return _.find(this, (value, index) => {
    var isFound = findFunction(value, index)

    if (isFound) {
      this.unshift(this.splice(index, 1)[0])
    }

    return isFound
  })
}