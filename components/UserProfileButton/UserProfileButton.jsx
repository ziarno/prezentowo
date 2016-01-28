UserProfileButton = React.createClass({
  propTypes: {
    picture: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },
  logout() {
    AccountsTemplates.logout();
  },
  render() {
    var pictureBackground = {
      'background-image': `url(${this.props.picture})`
    };

    return (
      <div className="user-profile-button btn-group">
        <div className="user-profile-button--name btn btn-default" style={pictureBackground}>
          <span>{this.props.name}</span>
        </div>
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu dropdown-menu--right dropdown-menu--with-icons">
          <li className="waves-effect">
            <a>
              <i className="fa fa-user"></i>
              Profil
            </a>
          </li>
          <li className="waves-effect">
            <a href="/change-password">
              <i className="fa fa-key"></i>
              Zmień hasło
            </a>
          </li>
          <li className="divider"></li>
          <li className="waves-effect" onClick={this.logout}>
            <a>
              <i className="fa fa-sign-out"></i>
              Wyloguj
            </a>
          </li>
        </ul>
      </div>
    )
  }
});