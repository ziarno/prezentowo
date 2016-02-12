UserProfileButton = React.createClass({
  propTypes: {
    pictureUrl: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },
  logout() {
    AccountsTemplates.logout();
  },
  openProfile() {
    ModalManager.open(<SimpleModal title={_i18n.__('Profile')}/>);
  },
  render() {
    var pictureBackground = {
      backgroundImage: `url(${this.props.pictureUrl.small})`
    };

    return (
      <div id="user-profile-button" className="ui buttons compact user-panel">
        <div className="user-profile-button--name ui button" style={pictureBackground}>
          <span>{this.props.name}</span>
        </div>
        <button type="button" className="ui icon button" data-toggle="dropdown">
          <i className="caret down icon"></i>
        </button>
        {/*<ul className="dropdown-menu dropdown-menu--right dropdown-menu--with-icons">
          <li className="waves-effect" onClick={this.openProfile}>
            <a>
              <i className="fa fa-user"></i>
              <T>Profile</T>
            </a>
          </li>
          <li className="waves-effect">
            <a href="/change-password">
              <i className="fa fa-key"></i>
              <T>Change password</T>
            </a>
          </li>
          <li className="divider"></li>
          <li className="waves-effect" onClick={this.logout}>
            <a>
              <i className="fa fa-sign-out"></i>
              <T>login.Logout</T>
            </a>
          </li>
        </ul>*/}
      </div>
    )
  }
});