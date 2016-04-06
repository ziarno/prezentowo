import React from 'react'
import {Tooltips} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

NotificationIcon = class NotificationIcon extends React.Component {

  getTooltips() {
    return {
      notificationIcon: {
        position: 'bottom right',
        content: _i18n.__('Notifications')
      }
    }
  }

  render() {
    return (
      <div
        className={classNames(
          'ui button compact icon',
          this.props.buttonClassName
        )}
        onClick={this.hideTooltips}
        ref="notificationIcon">
        <i className="alarm outline icon"></i>
      </div>
    )
  }

}

NotificationIcon.propTypes = {
  buttonClassName: React.PropTypes.string
}

reactMixin(NotificationIcon.prototype, Tooltips)