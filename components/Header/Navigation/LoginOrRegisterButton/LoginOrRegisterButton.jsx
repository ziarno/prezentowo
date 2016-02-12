LoginOrRegisterButton = React.createClass({
  render() {
    return (
      <div className="ui buttons compact user-panel">
        <a href="/sign-in" className="ui button">
          <i className="sign in icon"></i>
          <T>login.Login</T>
        </a>
        <a href="/sign-up" className="ui button">
          <i className="user icon"></i>
          <T>login.Register</T>
        </a>
      </div>
    )
  }
});