UserList = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    users: React.PropTypes.array.isRequired
  },

  getMeteorData() {
    var eventId = FlowRouter.getParam('eventId');

    return {
      event: Events.findOne(eventId),
      user: Meteor.user()
    };
  },

  isCreator() {
    return this.data.event && this.data.user &&
      (this.data.event.creatorId === this.data.user._id);
  },

  addParticipant(data) {
    Events.methods.addParticipant.call({
      eventId: this.data.event._id,
      sendEmail: data.sendEmail,
      participant: _.omit(data, 'sendEmail')
    }, function (error, participant) {
      console.log('error', error);
      console.log('data', participant);
    });
  },

  render() {

    return (
      <div
        id="user-list"
        className="shadow">

        <div
          className="user-list--title">
          {this.isCreator() ? (
            <AddParticipant
              onSubmit={this.addParticipant}
            />
          ) : null}
          <T>Participants</T>
        </div>

        <div
          className="user-list--list">

          {this.props.users.map((user) => (
            <UserItem
              key={user._id}
              user={user} />
          ))}

        </div>

      </div>
    );
  }
});