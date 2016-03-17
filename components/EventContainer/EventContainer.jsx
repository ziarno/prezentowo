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

        return name1 > name2 ? 1 : -1;
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

  isCreator() {
    var eventId = FlowRouter.getParam('eventId');
    var event = Events.findOne(eventId);

    return event && (event.creatorId === Meteor.userId());
  },

  render() {

    var event = Events.findOne(FlowRouter.getParam('eventId'));
    var eventTitle = event && event.title;

    return this.data.ready ? (
      <div id="event-container">
        <UserList
          isCreator={this.isCreator()}
          users={this.data.participants}
          presents={this.data.presents} />
        {this.isCreator() ? (
          <EventSettings />
        ) : null}
        <PresentsContainer
          users={this.data.participants}
          presents={this.data.presents} />
        <PresentPopup
          className="add-present-button"
          users={this.data.participants}
        />
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