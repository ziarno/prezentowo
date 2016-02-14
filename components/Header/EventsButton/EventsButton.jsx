EventsButton = React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired
  },

  mixins: [Mixins.dropdown],

  showCreateEventModal() {
    ModalManager.open(<CreateEventModal />);
  },

  getEventItem(event) {
    return (
      <div className="item event"
           onClick={this.showEvent.bind(this, event)}
           key={event._id}>
        <div className="description">
          {moment(event.date).format('L')}
        </div>
        <div className="text">
          {event.title}
        </div>
      </div>
    )
  },

  showEvent() {

  },

  render() {
    var now = new Date();
    var futureEvents = [];
    var pastEvents = [];

    this.props.events.forEach((event) => {
      if (now < event.date) {
        futureEvents.unshift(event);
      } else {
        pastEvents.unshift(event);
      }
    });

    return (
      <div  className="ui buttons compact">
        <div className={"ui icon button right labeled " +
                        "waves-effect waves-button" +
                        (!this.props.ready && "loading")}
             ref="dropdown-trigger">
          <T>Events</T>
          <i className="caret down icon"></i>
        </div>
        <div className="ui dropdown" ref="dropdown">
            <div className="menu">

              <div className="item new-event">
                <i className="plus icon"></i>
                <T>New event</T>
              </div>

              {!!futureEvents.length && (
              <div className="divider"></div>
              )}
              {futureEvents.map(this.getEventItem)}

              {!!pastEvents.length && (
              <div className="divider"></div>
              )}
              {!!pastEvents.length && (
              <div className="header">
                <T>Past events</T>
              </div>
              )}
              {pastEvents.map(this.getEventItem)}

            </div>
        </div>
      </div>
    );
  }
});