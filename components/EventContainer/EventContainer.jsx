EventContainer = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    var eventId = FlowRouter.getParam('eventId');
    var subscription = Meteor.subscribe('eventDetails', {eventId});
    var participants = Participants.find({}, {
      sort: {'profile.name': 1}
    }).fetch();
    var currentUserIndex;

    //move logged in user to top
    _.find(participants, (participant, index) => {
      currentUserIndex = index;
      return participant._id === Meteor.userId();
    });

    participants.unshift(
      participants.splice(currentUserIndex, 1)[0]
    );

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