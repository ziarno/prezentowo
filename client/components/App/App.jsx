App = React.createClass({
  render() {
    return (
      <div>
        <Header />
        <div className="content">
          <div className="btn-group">
            <button className="waves-effect btn btn-default">Default</button>
            <button className="waves-effect waves-light btn btn-primary">Primary</button>
            <button className="waves-effect waves-light btn btn-warning">Warning</button>
            <button className="waves-effect waves-light btn btn-info">Info</button>
            <button className="waves-effect waves-light btn btn-success">Success</button>
            <button className="waves-effect waves-light btn btn-danger">Danger</button>
            <button className="waves-effect waves-light btn btn-inverse">Inverse</button>
          </div>
          <button disabled className="waves-effect btn btn-default">Default</button>
          <button disabled className="waves-effect waves-light btn btn-primary">Primary</button>
          <button disabled className="waves-effect waves-light btn btn-warning">Warning</button>
          <button disabled className="waves-effect waves-light btn btn-info">Info</button>
          <button disabled className="waves-effect waves-light btn btn-success">Success</button>
          <button disabled className="waves-effect waves-light btn btn-danger">Danger</button>
          <button disabled className="waves-effect waves-light btn btn-inverse">Inverse</button>
        </div>
      </div>
    );
  }
});