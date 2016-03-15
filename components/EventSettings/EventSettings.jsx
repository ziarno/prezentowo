EventSettings = ({presentsCount, usersCount, isCreator}) => (
  <div
    id="event-settings">

    {isCreator ? (
      <div
        className="event-settings--buttons
          ui attached compact buttons">

        <div className="ui button waves-effect waves-button">
          <i className="setting large icon"/>
          <T>Options</T>
        </div>
        <ParticipantPopup />

      </div>
    ) : null}

    <div className="counts ui attached segment">
      <CountLabel
        icon="gift"
        count={presentsCount}
      />
      <CountLabel
        icon="user"
        count={usersCount}
      />
    </div>
  </div>
);