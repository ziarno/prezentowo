EventContainer = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    var eventId = FlowRouter.getParam('eventId');
    var subscription = Meteor.subscribe('eventDetails', {eventId});
    var participants = Participants
      .find()
      .fetch()
      .sort((participant1, participant2) => {
        var name1 = participant1.profile.name.capitalizeFirstLetter();
        var name2 = participant2.profile.name.capitalizeFirstLetter();

        return  name1 > name2 ? 1 : -1;
      });

    //move current user to top
    participants.moveToTop((participant) => (
      participant._id === Meteor.userId()
    ));

    return {
      ready: subscription.ready(),
      presents: Presents.find().fetch(),
      participants
    };
  },

  childContextTypes: {
    eventId: React.PropTypes.string,
  },

  getChildContext: function() {
    return {
      eventId: FlowRouter.getParam('eventId')
    };
  },

  render() {

    return (
      <div id="event-container">
        <Loader visible= {!this.data.ready} />
        <UserList
          users={this.data.participants} />
        <PresentsContainer
          users={this.data.participants}
          presents={this.data.presents} />
      </div>
    );
  }
});