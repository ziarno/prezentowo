EventContainer = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    var eventId = FlowRouter.getParam('eventId');
    var subscription = Meteor.subscribe('eventDetails', {eventId});

    return {
      ready: subscription.ready(),
      presents: Presents.find().fetch(),
      participants: Meteor.users.find().fetch()
    };
  },

  render() {
    return (
      <div id="event-container">
        <UserList
          users={this.data.participants} />
        <PresentsContainer
          presents={this.data.presents} />
      </div>
    )
  }
});