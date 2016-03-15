EventSettings = React.createClass({

  render() {
    return (
      <div
        id="event-settings">

        <div
          className="event-settings--buttons
            ui attached compact buttons">
          <div className="ui button waves-effect waves-button">
            <i className="setting large icon"/>
            Opcje
          </div>

          <ParticipantPopup />

        </div>

        <div className="counts ui attached segment">
          <CountLabel
            icon="gift"
            count={this.props.presentsCount}
          />
          <CountLabel
            icon="user"
            count={this.props.usersCount}
          />
        </div>
      </div>
    );
  }
});