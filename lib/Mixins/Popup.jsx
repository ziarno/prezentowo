/**
 * Popup Mixin
 *
 * requires:
 *  this.refs.popupTrigger (typically a button)
 *  this.refs.popup
 *  this.getPopupSettings() (optional) - settings passed to semantic ui's popup() method
 */
var PopupMixin = {

  setPopup() {
    var popupSettings = _.isFunction(this.getPopupSettings) ?
      this.getPopupSettings() : {};

    $(this.refs.popupTrigger).popup({
      popup: $(this.refs.popup),
      on: 'click',
      hideOnScroll: false,
      position: 'bottom left',
      lastResort: 'bottom left',
      ...popupSettings
    });
  },

  hidePopup(callback) {
    $(this.refs.popupTrigger).popup('hide', callback);
  },

  componentDidMount() {
    this.setPopup();
  }

};

export default PopupMixin;