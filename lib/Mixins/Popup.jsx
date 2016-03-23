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
      this.getPopupSettings() : {}
    var popupRefName = popupSettings.popupRefName || 'popup'

    $(this.refs.popupTrigger).popup({
      popup: $(ReactDOM.findDOMNode(this.refs[popupRefName])),
      on: 'click',
      hideOnScroll: false,
      position: 'bottom left',
      lastResort: 'bottom left',
      movePopup: false,
      jitter: 0,
      ...popupSettings
    })
  },

  hidePopup(callback) {
    $(this.refs.popupTrigger).popup('hide', callback)
  },

  componentDidMount() {
    this.setPopup()
  }

}

export default PopupMixin