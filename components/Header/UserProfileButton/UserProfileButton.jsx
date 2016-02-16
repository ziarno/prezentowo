UserProfileButton = React.createClass({
  propTypes: {
    pictureUrl: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },
  componentDidMount() {
    $(this.refs.logout).popup({
      content: _i18n.__('Logout'),
      variation: 'inverted tiny',
      position: 'bottom right',
      delay: {
        show: 500
      }
    });
  },
  logout() {
    AccountsTemplates.logout();
    $(this.refs.logout).popup('hide');
  },
  openProfile() {
    ModalManager.open(<SimpleModal title={_i18n.__('Profile')}/>);
  },
  render() {
    var pictureBackground = {
      backgroundImage: `url(${this.props.pictureUrl.small})`
    };

    return (
      <div id="user-profile-button"
           className="ui buttons compact">
        <div className="user-profile-button--name ui button"
             onClick={this.openProfile}
             style={pictureBackground}>
          <span>{this.props.name}</span>
        </div>
        <div className="ui icon button"
             ref="logout"
             onClick={this.logout}>
          <i className="sign out icon"></i>
        </div>
      </div>
    );
  }
});