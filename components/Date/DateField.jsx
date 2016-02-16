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
    var dateText = moment(this.props.date).from(new Date());
    var startOfToday = moment().startOf('day');
    var startOfDate = moment(this.props.date).startOf('day');
    var daysDiff = startOfDate.diff(startOfToday, 'days');
    var days = {
      '0': _i18n.__('today'),
      '-1': _i18n.__('yesterday'),
      '1': _i18n.__('tomorrow')
    };

    if (this.props.roundToDays && Math.abs(daysDiff) <= 1) {
      dateText = days[daysDiff];
    }

    return (
      <span className={this.props.className}
            onClick={this.hidePopup}>
        {dateText}
      </span>
    );
  }
});