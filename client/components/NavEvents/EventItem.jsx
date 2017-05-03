import React from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

EventItem = ({ event, onClick, active }) => {
  //maybe will be used...
  const EventTypeLabel = event.type === 'many-to-many' ? (
    <Label
      className="basic">
      <i className="users icon" />
      <i className="exchange icon" />
      <i className="users icon" />
    </Label>
  ) : (
    <Label
      className="basic">
      <i className="users icon" />
      <i className="long arrow right icon" />
      <i className="user icon" />
    </Label>
  )

  const PresentsLabel = (
    <CountLabel
      tooltip="Presents count"
      className="basic"
      icon="gift"
      count={Events.functions.getPresentsCount(event)}
    />
  )

  const ParticipantsLabel = (
    <CountLabel
      tooltip="Participants count"
      className="basic"
      icon="user"
      count={event.participantsCount}
    />
  )

  const DateLabel = (
    <Label className="basic">
      <DateField
        date={event.date}
        roundToDays
      />
    </Label>
  )

  return (
    <div
      className={classNames('item event flex', { active })}
      onClick={() => onClick(event)}
    >
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
