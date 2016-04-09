import React from 'react'
EventItem = ({event, onClick, active}) => {
  //maybe will be used...
  var EventTypeLabel = event.type === 'many-to-many' ? (
    <Label
      className="basic">
      <i className="users icon"></i>
      <i className="exchange icon"/>
      <i className="users icon"></i>
    </Label>
  ) : (
    <Label
      className="basic">
      <i className="users icon"></i>
      <i className="long arrow right icon"/>
      <i className="user icon"></i>
    </Label>
  )

  var PresentsLabel = (
    <CountLabel
      tooltip={_i18n.__('Presents count')}
      className="basic"
      icon="gift"
      count={Events.functions.getPresentsCount(event)} />
  )

  var ParticipantsLabel = (
    <CountLabel
      tooltip={_i18n.__('Participants count')}
      className="basic"
      icon="user"
      count={event.participants.length} />
  )

  var DateLabel = (
    <Label
      className="basic">
      <DateField date={event.date} roundToDays />
    </Label>
  )

  return (
    <div className={classNames('item event flex', {active})}
         onClick={() => onClick(event)}>
      <div className="text">
        {event.title}
      </div>
      <div className="labels">
        {ParticipantsLabel}
        {PresentsLabel}
        {DateLabel}
      </div>
    </div>
  )
}