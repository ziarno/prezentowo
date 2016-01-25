Login = React.createClass({
  onSubmit(event) {
    event.preventDefault();
  },
  render() {
    return (
      <div className="row login">
        <div className="well">
          <legend>Zaloguj się</legend>
          <div className="login-alert"></div>
          <form className="input-group-vertical" onSubmit={this.onSubmit}>
            <div className="input-group input-group-lg">
              <span className="input-group-addon top-left">
                <span className="glyphicon glyphicon-envelope"></span>
              </span>
              <input name="email"
                     type="email"
                     className="form-control top-right"
                     placeholder="Email" />
            </div>
            <div className="input-group input-group-lg">
              <span className="input-group-addon bottom-left">
                <span className="glyphicon glyphicon-lock"></span>
              </span>
              <input name="password"
                     type="password"
                     className="form-control bottom-right"
                     placeholder="Hasło" />
            </div>
            <button type="submit"
                    className="login-button btn btn-primary btn-block waves-effect waves-light"
                    data-loading-text="Logowanie..." >
              Zaloguj
            </button>
          </form>
        </div>
      </div>
    );
  }
});