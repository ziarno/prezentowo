import React from 'react'
import {Tooltips} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

NavProfile = class NavProfile extends React.Component {

  constructor() {
    super()
    this.getTooltips = this.getTooltips.bind(this)
  }

  getTooltips() {
    return {
      //profile: {content: _i18n.__('Profile')}
    }
  }

  render() {
    return (
      <div
        id="user-profile-button"
        className="popup-button-group"
        onClick={this.hideTooltips}>
        <UserProfilePopup
          buttonClassName="popup-button"
          popupClassName="non-pointing"
        />
        <NotificationsPopup
          buttonClassName="popup-button"
          popupClassName="non-pointing"
        />
      </div>
    )
  }
}

NavProfile.propTypes = {
  pictureUrl: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func
}

reactMixin(NavProfile.prototype, Tooltips)