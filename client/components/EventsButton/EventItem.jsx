import React from 'react'
EventItem = ({event, onClick}) => (
  <div className="item event flex"
       onClick={() => onClick(event)}>
    <div className="text">
      <i className={classNames({
        user: event.type === 'many-to-one',
        users: event.type === 'many-to-many'
      }, 'disabled icon')}></i>
      {event.title}
    </div>
    <div className="description">
      <DateField date={event.date} roundToDays />
    </div>
  </div>
)