EventContainer = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    var eventId = FlowRouter.getParam('eventId');
    var subscription = Meteor.subscribe('eventDetails', {eventId});
    var participants = Participants
      .find()
      .fetch()
      .sort((participant1, participant2) => {
        return participant1._id === Meteor.userId() ?
          -1 : (participant1.profile.name.capitalizeFirstLetter() >
            participant2.profile.name.capitalizeFirstLetter());
      });

    return {
      ready: subscription.ready(),
      presents: Presents.find().fetch(),
      participants
    };
  },

  render() {

    if (!this.data.ready) {
      return <span>loading...</span>;
    }

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