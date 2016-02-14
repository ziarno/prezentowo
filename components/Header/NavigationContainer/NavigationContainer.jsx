NavigationContainer = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var eventsSubscribtion = Meteor.subscribe('events');

    return {
      ready: eventsSubscribtion.ready(),
      events: Events.find().fetch(),
      user: Meteor.user()
    };
  },
  getLoggedInNavigation() {
    return (
      <div id="navigation-container">
        <EventsButton events={this.data.events} ready={this.data.ready} />
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