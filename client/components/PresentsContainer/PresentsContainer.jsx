PresentsContainer = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired,
    presents: React.PropTypes.array.isRequired
  },

  render() {

    return (
      <div id="presents-container">

        {this.props.users.map((user) => (
          <UserPresents
            key={user._id}
            user={user}
            presents={this.props.presents.filter((present) => (
              present.forUserId === user._id
            ))}
          />
        ))}

      </div>
    );
  }
});