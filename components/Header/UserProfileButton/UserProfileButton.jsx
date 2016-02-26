UserProfileButton = React.createClass({
  propTypes: {
    pictureUrl: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },
  componentDidMount() {
    $(this.refs.logout).popup({
      ...Config.popup,
      content: _i18n.__('Logout')
    });
    $(this.refs.profile).popup({
      ...Config.popup,
      content: _i18n.__('Profile')
    });
  },
  componentWillUnmount() {
    $(this.refs.logout).popup('destroy');
    $(this.refs.profile).popup('destroy');
  },
  logout() {
    AccountsTemplates.logout();
  },
  openProfile() {
    ModalManager.open(<SimpleModal title={_i18n.__('Profile')}/>);
  },
  hidePopups() {
    $(this.refs.logout).popup('hide');
    $(this.refs.profile).popup('hide');
  },
  render() {
    var pictureBackground = {
      backgroundImage: `url(${this.props.pictureUrl.small})`
    };

    return (
      <div
        id="user-profile-button"
        className="ui buttons compact"
        onClick={this.hidePopups}>
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