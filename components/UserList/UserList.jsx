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

  setSticky() {
    $(this.refs.sticky).sticky({
      context: '#event-container',
      offset: 50
    });
  },

  componentDidMount() {
    this.setSticky();
  },

  componentDidUpdate() {
    this.setSticky();
  },

  render() {

    return (
      <div
        id="user-list"
        className="shadow">
        <div
          ref="sticky"
          className="ui sticky">

          <div
            className="user-list--title">
            {this.isCreator() ? (
              <ParticipantPopup />
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

      </div>
    );
  }
});