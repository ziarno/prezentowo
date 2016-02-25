EventItem = ({event, onClick}) => (
  <div className="item event flex"
       onClick={onClick}>
    <div className="text">
      {event.title}
    </div>
    <div className="description">
      <DateField date={event.date} roundToDays />
    </div>
  </div>
);