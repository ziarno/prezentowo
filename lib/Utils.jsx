Utils = {
  attachWaves() {
    Waves.attach('.button:not(.no-waves)', ['waves-button']);
  }
};

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
