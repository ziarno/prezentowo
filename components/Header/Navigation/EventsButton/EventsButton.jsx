EventsButton = React.createClass({
  render() {
    return (
      <div className="btn-group nav-group">
        <div className="btn btn-default">
          <T>Events</T>&nbsp;
          <span className="caret"></span>
        </div>
        <div className="btn btn-default">
          <i className="fa fa-plus"></i>
        </div>
      </div>
    )
  }
});