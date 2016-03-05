UserItem = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getMeteorData() {
    return {
      presentsCount: Presents.find({
        forUserId: this.props.user._id
      }).count()
    };
  },

  render() {
    return (
      <div className="user-list--item waves-effect">
        <User user={this.props.user} />
        <div className="presents-count ui label">
          <i className="gift icon"></i>
          {this.data.presentsCount}
        </div>
      </div>
    );
  }
});