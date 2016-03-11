UserPresents = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    presents: React.PropTypes.array.isRequired
  },

  render() {

    return (
      <div className="user-presents">

        <PresentPopup />

        <div className="ui horizontal divider">
          <User user={this.props.user} />
          <div className="circular ui icon button right waves-effect waves-button">
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