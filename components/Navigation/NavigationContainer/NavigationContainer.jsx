NavigationContainer = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    };
  },
  getNavigation() {
    return (
      <div>
        <EventsButton />
        <UserProfileButton {...this.data.user.profile} />
      </div>
    )
  },
  render() {
    return (
      <div className="navigation-container">
        {this.data.user ?
          this.getNavigation() :
          <LoginOrRegisterButton />}
      </div>
    )
  }
});