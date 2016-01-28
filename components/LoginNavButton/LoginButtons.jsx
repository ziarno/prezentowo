LoginButtons = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    };
  },
  getLoginButtons() {
    return (
      <div className="btn-group">
        <a href="/sign-in" className="btn btn-default">
          <i className="fa fa-sign-in"></i>
          <span>Zaloguj</span>
        </a>
        <a href="/sign-up" className="btn btn-default">
          <i className="glyphicon glyphicon-user"></i>
          <span> Zarejestruj</span>
        </a>
      </div>
    )
  },
  getProfileButton() {
    return <UserProfileButton
      picture={this.data.user.profile.picture}
      name={this.data.user.profile.name}/>
  },
  render() {
    return (
      <div className="login-nav-button">
        {this.data.user ?
          this.getProfileButton() :
          this.getLoginButtons()}
      </div>
    );
  }
});