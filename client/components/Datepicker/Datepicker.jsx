import {InputValidation} from '../../../lib/Mixins';

Datepicker = React.createClass({

  mixins: [InputValidation],

  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string
  },

  reset() {
    $(this.refs.datepicker).datepicker('clearDates');
  },

  getValue() {
    return $(this.refs.datepicker).datepicker('getDate');
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
        startView: 1,
        title: () => this.props.label
      })
      .on('changeDate', () => {
        var value = this.getValue();
        this.validate(value);
        this.onChange(value);
      });
  },

  componentWillUnmount() {
    $(this.refs.datepicker)
      .datepicker('destroy');
  },

  render() {
    return (
      <div
        className={classNames({
          'with-title': this.props.label
        })}
        ref="datepicker"
      />
    );
  }
});