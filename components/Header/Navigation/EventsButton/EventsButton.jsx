EventsButton = React.createClass({

  showCreateEventModal() {
    ModalManager.open(<CreateEventModal />);
  },

  render() {
    return (
      <div className="ui buttons compact">
        <div className="ui icon button">
          <T>Events</T>
          <i className="caret down icon"></i>
        </div>
        <div className="ui button icon" onClick={this.showCreateEventModal}>
          <i className="plus icon"></i>
        </div>
      </div>
    )
  }
});