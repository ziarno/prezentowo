NotificationIcon = React.createClass({
  mixins: [Mixins.Tooltips],
  getTooltips() {
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
        onClick={this.hideTooltips}
        ref="notificationIcon">
        <i className="alarm outline icon"></i>
      </div>
    );
  }
});