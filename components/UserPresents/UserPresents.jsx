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