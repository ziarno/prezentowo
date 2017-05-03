import React, { Component, PropTypes } from 'react'
import reactMixin from 'react-mixin'
import { Tooltips } from '../../../lib/Mixins'

NavProfile = class NavProfile extends Component {

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
        onClick={this.hideTooltips}
      >
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
  pictureUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

reactMixin(NavProfile.prototype, Tooltips)
