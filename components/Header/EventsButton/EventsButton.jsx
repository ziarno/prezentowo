EventsButton = React.createClass({

  mixins: [Mixins.dropdown],

  showCreateEventModal() {
    ModalManager.open(<CreateEventModal />);
  },

  render() {
    return (
      <div className="ui buttons compact">
        <div className="ui icon button right labeled">
          <T>Events</T>
          <i className="caret down icon"></i>
        </div>
      </div>
    )
  }
});