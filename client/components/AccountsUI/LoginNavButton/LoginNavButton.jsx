LoginNavButton = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    };
  },
  render() {
    return (
      <div className="login-nav-button">
        {this.data.user ?
          <span>{this.data.user._id}</span> :
          <a className="btn btn-primary">Zaloguj / Zarejestruj</a>}
      </div>
    );
  }
});