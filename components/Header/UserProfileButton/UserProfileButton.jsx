import {Tooltips} from '../../../lib/Mixins';

UserProfileButton = React.createClass({
  mixins: [Tooltips],
  propTypes: {
    pictureUrl: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },
  getTooltips() {
    return {
      logout: {content: _i18n.__('Logout')},
      profile: {content: _i18n.__('Profile')}
    };
  },
  logout() {
    AccountsTemplates.logout();
    this.hideTooltips();
  },
  openProfile() {
    ModalManager.open(<SimpleModal title={_i18n.__('Profile')} />);
    this.hideTooltips();
  },
  render() {
    var pictureBackground = {
      backgroundImage: `url(${this.props.pictureUrl.small})`
    };

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
        <div
          className="ui icon button"
          ref="logout"
          onClick={this.logout}>
          <i className="sign out icon"></i>
        </div>
      </div>
    );
  }
});