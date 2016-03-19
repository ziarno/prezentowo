EventsButton = React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired
  },

  showEvent(event) {
    FlowRouter.go(`/event/id/${event._id}`);
  },

  componentDidMount() {
    $(this.refs.dropdown).dropdown({
      action: 'hide'
    });
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
      <div className="ui buttons compact">

        <div id="events-button"
             className={classNames('ui icon right labeled top right pointing scrolling dropdown button', {
              loading: !this.props.ready
             })}
             ref="dropdown">
          <T>Events</T>
          <i className="caret down icon"></i>

          <div className="menu">
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

        <EventPopup />

      </div>
    );
  }
});