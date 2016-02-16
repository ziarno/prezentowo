DateField = React.createClass({
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).popup({
      ...Config.popup,
      position: 'right center',
      variation: 'mini',
      content: moment(this.props.date).format('L')
    });
  },
  hidePopup() {
    $(ReactDOM.findDOMNode(this)).popup('hide');
  },
  componentWillUnmount() {
    this.hidePopup();
  },
  render() {
    return (
      <span className={this.props.className}
            onClick={this.hidePopup}>
        {moment(this.props.date).fromNow()}
      </span>
    );
  }
});