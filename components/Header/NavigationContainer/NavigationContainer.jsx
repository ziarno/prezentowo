NavigationContainer = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    };
  },
  getLoggedInNavigation() {
    return (
      <div id="navigation-container">
        <EventsButton />
        <UserProfileButton {...this.data.user.profile} />
        <NotificationIcon />
      </div>
    );
  },
  getLoggedOutNavigation() {
    return (
      <div id="navigation-container">
        <LoginOrRegisterButton />
      </div>
    );
  },
  render() {
    return this.data.user ?
      this.getLoggedInNavigation() :
      this.getLoggedOutNavigation();
  }
});