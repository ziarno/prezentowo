DateField = React.createClass({

  componentDidMount() {
    this.setPopup();
    _i18n.onChangeLocale(this.setPopup);
  },

  setPopup() {
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

    $(ReactDOM.findDOMNode(this)).popup({
      ...Config.popup,
      position: 'right center',
      variation: 'mini',
      delay: {
        show: 100,
        hide: 0
      },
      content: dateText
    });
  },

  hidePopup() {
    $(ReactDOM.findDOMNode(this)).popup('hide');
  },

  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this)).popup('destroy');
    _i18n.offChangeLocale(this.setPopup);
  },

  render() {
    return (
      <span
        className={this.props.className}
        onClick={this.hidePopup}
        onMouseEnter={this.setPopup}>

        {moment(this.props.date).format('L')}
      </span>
    );
  }
});