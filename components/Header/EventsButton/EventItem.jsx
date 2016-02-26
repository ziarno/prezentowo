EventItem = ({event, onClick}) => (
  <div className="item event flex"
       onClick={() => onClick(event)}>
    <div className="text capitalize">
      {event.title}
    </div>
    <div className="description">
      <DateField date={event.date} roundToDays />
    </div>
  </div>
);