import React from 'react'

NavEvents = class NavEvents extends React.Component {

  showEvent(event) {
    FlowRouter.go(`/event/id/${event._id}`)
  }

  componentDidMount() {
    $(this.refs.dropdown).dropdown({
      action: 'hide'
    })
  }

  render() {
    var event = Session.get('event')
    var now = new Date()
    var activeEvents = []
    var pastEvents = []
    var activeEventsHeader
    var isCreator = event.creatorId === Meteor.userId()

    this.props.events.forEach((event) => {
      if (now < event.date) {
        activeEvents.unshift(event)
      } else {
        pastEvents.unshift(event)
      }
    })

    activeEventsHeader = activeEvents.length ?
      <T>Active events</T> :
      <T>No active events</T>

    return (
      <div
        id="nav-events"
        className="popup-button-group">

        <div className={classNames('events-dropdown popup-button ' +
              'ui compact icon right labeled top right ' +
              'pointing scrolling dropdown button', {
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
            {this.props.events.length === 0 ? ( //dummy div - semantic only shows dropdown if there is at least 1 .item
              <div className="item" style={{display: 'none'}}></div>
            ) : null}

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

        <EventPopup
          icon={(
            <i className="plus icon" />
          )}
          buttonClassName="popup-button"
        />

        {isCreator ? (
          <EventPopup
            icon={(
              <i className="setting icon" />
            )}
            buttonClassName="popup-button"
            event={event}
          />
        ) : null}

        {isCreator ? (
          <ParticipantPopup
            icon={(
              <i className="add user icon" />
            )}
            buttonClassName="popup-button"
          />
        ) : null}

      </div>
    )
  }
}

NavEvents.propTypes = {
  events: React.PropTypes.array.isRequired
}