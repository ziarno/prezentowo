import React from 'react'

/**
 * Requires:
 *
 * this.refs.scrollContainer
 * this.getScrollToOptions() - optional
 */
export default class ScrollableComponent extends React.Component {

  scrollTo(scrollToEl) {
    if (!this.isScrollable) {
      return
    }

    var scrollContainer = this.refs.scrollContainer ||
      document.body
    var scrollToOptions = _.isFunction(this.getScrollToOptions) &&
      this.getScrollToOptions()

    if (scrollToEl &&
      scrollToEl !== this.props.scrollToEl) {
      $(scrollContainer).scrollTo(scrollToEl, {
        duration: 1000,
        ...scrollToOptions
      })
    }
  }

  componentWillReceiveProps({scrollToEl}) {
    this.scrollTo(scrollToEl)
  }

  componentDidMount() {
    if (_.isFunction(this.context.registerScrollableComponent)) {
      this.context.registerScrollableComponent(this)
    }
  }

}

ScrollableComponent.prototype.isScrollable = true

ScrollableComponent.propTypes = {
  scrollToEl: React.PropTypes.element
}