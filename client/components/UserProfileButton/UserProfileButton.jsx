import {Tooltips} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

UserProfileButton = class UserProfileButton extends React.Component {

  constructor() {
    super()
    this.getTooltips = this.getTooltips.bind(this)
    this.logout = this.logout.bind(this)
    this.openProfile = this.openProfile.bind(this)
  }

  getTooltips() {
    return {
      profile: {content: _i18n.__('Profile')}
    }
  }

  logout() {
    AccountsTemplates.logout()
    this.hideTooltips()
  }

  openProfile() {
    this.hideTooltips()
  }

  render() {
    var pictureBackground = {
      backgroundImage: `url(${this.props.pictureUrl})`
    }

    return (
      <div
        id="user-profile-button"
        className="ui buttons compact"
        onClick={this.hideTooltips}>
        <div
          className="user-profile-button--name ui button capitalize"
          onClick={this.openProfile}
          style={pictureBackground}
          ref="profile">
          <span>{this.props.name}</span>
        </div>
        <NotificationIcon />
      </div>
    )
  }
}

UserProfileButton.propTypes = {
  pictureUrl: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func
}

reactMixin(UserProfileButton.prototype, Tooltips)