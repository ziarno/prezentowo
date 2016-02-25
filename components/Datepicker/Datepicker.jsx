Datepicker = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    $(this.refs.datepicker)
      .datepicker({
        language: Language.get(),
        defaultViewDate: {
          month: 11,
          day: 24
        },
        startDate: new Date(),
        weekStart: 1,
        startView: 1
      })
      .on('changeDate', () => {
        var date = $(this.refs.datepicker).datepicker('getDate');

        this.props.onChange(date);
      });
  },

  componentWillUnmount() {
    $(this.refs.datepicker)
      .datepicker('destroy');
  },

  render() {
    return <div ref="datepicker"></div>;
  }
});