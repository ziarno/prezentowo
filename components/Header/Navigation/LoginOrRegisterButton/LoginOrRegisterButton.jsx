LoginOrRegisterButton = React.createClass({
  render() {
    return (
      <div className="btn-group nav-group">
        <a href="/sign-in" className="btn btn-default">
          <i className="fa fa-sign-in fa--space-right"></i>
          <T>login.Login</T>
        </a>
        <a href="/sign-up" className="btn btn-default">
          <i className="glyphicon glyphicon-user"></i>&nbsp;
          <T>login.Register</T>
        </a>
      </div>
    )
  }
});