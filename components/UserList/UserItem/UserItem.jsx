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
      <div className="user-list--item capitalize waves-effect">
        <img
          className="ui avatar image"
          src={this.props.user.profile.pictureUrl.small} />
        <span>{this.props.user.profile.name}</span>
        <div className="presents-count ui label">
          <i className="gift icon"></i>
          {this.data.presentsCount}
        </div>
      </div>
    );
  }
});