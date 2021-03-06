import React from 'react'
import ReactDOM from 'react-dom'

/**
 * PopupComponent
 *
 * requires:
 *  renderTrigger() (typically a button)
 *  renderTarget() - popup
 *  getPopupSettings() (optional) - settings passed to semantic ui's popup() method
 *
 *  note: do not create a render() function for inheriting components
 */
class PopupComponent extends React.Component {

  constructor() {
    super()
    this.state = {
      showPopup: false
    }
    this.setPopup = this.setPopup.bind(this)
    this.hidePopup = this.hidePopup.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.destroyPopup = this.destroyPopup.bind(this)
    this.hideAndReset = this.hideAndReset.bind(this)
  }

  setPopup() {
    var self = this
    var popupSettings = {
      ...(_.isFunction(this.getPopupSettings) &&
        this.getPopupSettings()),
      ...this.props.popupSettings
    }
    var $popupTrigger =
      $(ReactDOM.findDOMNode(this.refs.popupTrigger))
    var $popupTarget =
      $(ReactDOM.findDOMNode(this.refs.popupTarget))

    $popupTrigger.popup({
      popup: $popupTarget,
      on: 'click',
      hideOnScroll: false,
      position: 'bottom left',
      lastResort: 'bottom left',
      movePopup: false,
      ...popupSettings,
      onVisible() {
        if (self.refs.autofocus) {
          $(ReactDOM.findDOMNode(self.refs.autofocus))
            .find('input')
            .focus()
        }
        if (_.isFunction(popupSettings.onVisible)) {
          popupSettings.onVisible.apply(this, arguments)
        }
      }
    })
  }

  reset() {
    if (this.schema) {
      this.schema.resetValidation()
    }
    this.destroyPopup()
  }

  hideAndReset(callback) {
    this.hidePopup(() => {
      this.reset()
      if (_.isFunction(callback)) {
        callback.call(this)
      }
    })
  }

  destroyPopup() {
    this.setState({showPopup: false})
    $(ReactDOM.findDOMNode(this.refs.popupTrigger))
      .popup('destroy')
  }

  hidePopup(callback) {
    $(ReactDOM.findDOMNode(this.refs.popupTrigger))
      .popup('hide', callback)
  }

  showPopup() {
    this.setState({showPopup: true})
  }

  /**
   * Renders popup trigger.
   * Must have:
   * - ref="popupTrigger"
   * - onClick={this.showPopup}
   * @override
   * @returns {React.Component}
   */
  renderTrigger() {
    return (
      <div
        ref="popupTrigger"
        onClick={this.showPopup}
      ></div>
    )
  }

  /**
   * Renders popup target.
   * Must have:
   * - ref="popupTarget"
   * @override
   * @returns {React.Component}
   */
  renderPopup() {
    return <div ref="popupTarget"></div>
  }

  renderAdditionalContent() {
    return null
  }

  componentDidUpdate(prevProps, {showPopup}) {
    if (this.state.showPopup &&
        this.state.showPopup !== showPopup) {
      this.setPopup()
      $(ReactDOM.findDOMNode(this.refs.popupTrigger))
        .popup('show')
    }
  }

  componentWillUnmount() {
    this.destroyPopup()
  }

  render() {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={this.props.wrapperClassName}>
        {this.renderTrigger()}
        {this.state.showPopup ? (
          this.renderPopup()
        ) : null}
        {this.renderAdditionalContent()}
      </div>
    )
  }

}

PopupComponent.propTypes = {
  wrapperClassName: React.PropTypes.string
}

export default PopupComponent