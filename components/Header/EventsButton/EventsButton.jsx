EventsButton = React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired
  },

  mixins: [Mixins.dropdown],

  showCreateEventModal() {
    ModalManager.open(<CreateEventModal />);
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
        <div id="events-button"
             className={classNames('ui icon button right labeled waves-effect waves-button', {
              loading: !this.props.ready
             })}
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
              <div
                className={classNames('header', {
                  inactive: !activeEvents.length
                })}>
                {activeEventsHeader}
              </div>
              {activeEvents.map((event) => (
                <EventItem
                  key={event._id}
                  event={event}
                  onClick={this.showEvent}
                />
              ))}

              {!!pastEvents.length && (
              <div className="divider"></div>
              )}
              {!!pastEvents.length && (
              <div className="header">
                <T>Past events</T>
              </div>
              )}
              {pastEvents.map((event) => (
                <EventItem
                  key={event._id}
                  event={event}
                  onClick={this.showEvent}
                />
              ))}

            </div>
        </div>
      </div>
    );
  }
});