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
      <div className="item event flex"
           onClick={this.showEvent.bind(this, event)}
           key={event._id}>
        <div className="text">
          {event.title}
        </div>
        <div className="description">
          <DateField date={event.date} />
        </div>
      </div>
    );
  },

  showEvent() {

  },

  render() {
    var now = new Date();
    var activeEvents = [];
    var pastEvents = [];
    var activeEventsHeader;

    this.props.events.forEach((event) => {
      if (now < event.date) {
        activeEvents.unshift(event);
      } else {
        pastEvents.unshift(event);
      }
    });

    activeEventsHeader = activeEvents.length ?
      <T>Active events</T> :
      <T>No active events</T>;

    return (
      <div  className="ui buttons compact">
        <div className={"ui icon button right labeled " +
                        "waves-effect waves-button " +
                        (!this.props.ready ? "loading": "")}
             ref="dropdown-trigger">
          <T>Events</T>
          <i className="caret down icon"></i>
        </div>
        <div className="ui dropdown" ref="dropdown">
            <div className="menu">

              <div className="item new-event"
                   onClick={this.showCreateEventModal}>
                <i className="plus icon"></i>
                <T>New event</T>
              </div>

              <div className="divider"></div>
              <div className={"header " + (!activeEvents.length ? "inactive" : "")}>
                {activeEventsHeader}
              </div>
              {activeEvents.map(this.getEventItem)}

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