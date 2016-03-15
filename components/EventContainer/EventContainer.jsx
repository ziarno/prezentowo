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

    var event = Events.findOne(FlowRouter.getParam('eventId'));
    var eventTitle = event && event.title;

    return this.data.ready ? (
      <div id="event-container">
        <UserList
          users={this.data.participants} />
        <EventSettings
          usersCount={this.data.participants.length}
          presentsCount={this.data.presents.length}
        />
        <PresentsContainer
          users={this.data.participants}
          presents={this.data.presents} />
      </div>
    ) : (
      <div id="event-container">
        <Loader
          size="large"
          text={eventTitle ?
            _i18n.__('Loading event', {title: eventTitle}) :
            null}
        />
      </div>
    );
  }
});