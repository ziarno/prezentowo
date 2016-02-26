UserList = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div
        id="user-list"
        className="shadow">
        <div
          className="user-list--title">
          <T>Participants</T>
        </div>
        <div
          className="user-list--list">

          {this.props.users.map((user) => (
            <UserItem
              key={user._id}
              user={user} />
          ))}

        </div>

      </div>
    );
  }
});