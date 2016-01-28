LoginButtons = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    };
  },
  componentDidMount() {
    Waves.attach('.btn:not(.waves-effect)', ['waves-effect']);
  },
  componentDidUpdate() {
    Waves.attach('.btn:not(.waves-effect)', ['waves-effect']);
  },
  getLoginButtons() {
    return (
      <div className="btn-group">
        <a href="/sign-in" className="btn btn-default">
          <i className="fa fa-sign-in"></i>
          <span>Zaloguj</span>
        </a>
        <a href="/sign-up" className="btn btn-default">
          <i className="fa fa-sign-up"></i>
          <span>Zarejestruj</span>
        </a>
      </div>
    )
  },
  getProfileButton() {
    return (
      <div>
        <img src={this.data.user.profile.picture} />
        <span>{this.data.user.profile.name}</span>
      </div>
    )
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