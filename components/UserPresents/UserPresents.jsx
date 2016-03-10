UserPresents = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    presents: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div className="user-presents">
        <div className="ui horizontal divider">
          <User user={this.props.user} />
          <div className="circular ui icon button left waves-effect waves-button">
            <i className="large icons">
              <i className="gift icon"></i>
              <i className="plus corner icon"></i>
            </i>
          </div>
          <div className="ui icon button right waves-effect waves-button">
            <i className="chevron up icon"></i>
          </div>
        </div>

        {this.props.presents.length ? this.props.presents.map((present) => (
          <Present key={present._id} present={present} />
        )) : (
          <div className="no-results">
            <i className="huge gift icon" />
            <br />
            <T>No presents</T>
          </div>
        )}

      </div>
    );
  }
});