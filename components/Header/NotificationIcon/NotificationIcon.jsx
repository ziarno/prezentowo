NotificationIcon = React.createClass({
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).popup({
      ...Config.popup,
      position: 'bottom right',
      content: _i18n.__('Notifications')
    });
  },
  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this)).popup('destroy');
  },
  hidePopup() {
    $(ReactDOM.findDOMNode(this)).popup('hide');
  },
  render() {
    return (
      <div className="ui button compact icon"
           onClick={this.hidePopup}>
        <i className="alarm outline icon"></i>
      </div>
    );
  }
});