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
        className="ui button compact icon"
        onClick={this.hideTooltips}
        ref="notificationIcon">
        <i className="alarm outline icon"></i>
      </div>
    )
  }

}

reactMixin(NotificationIcon.prototype, Tooltips)