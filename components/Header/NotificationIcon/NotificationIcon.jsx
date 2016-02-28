NotificationIcon = React.createClass({
  mixins: [Mixins.popup],
  getPopups() {
    return {
      notificationIcon: {
        position: 'bottom right',
        content: _i18n.__('Notifications')
      }
    };
  },
  render() {
    return (
      <div
        className="ui button compact icon"
        onClick={this.hidePopup}
        ref="notificationIcon">
        <i className="alarm outline icon"></i>
      </div>
    );
  }
});