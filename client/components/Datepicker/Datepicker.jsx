import {InputValidation, RefreshOnLocaleChange} from '../../../lib/Mixins';
import moment from 'moment';

Datepicker = React.createClass({

  mixins: [InputValidation],

  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string
  },

  reset() {
    this.setDatepicker();
  },

  getValue() {
    return $(this.refs.datepicker).datepicker('getDate');
  },

  setValue(value) {
    this.setDatepicker({startView: 0});
    $(this.refs.datepicker)
      .datepicker('setDate', value);
  },

  setDatepicker(options) {
    $(this.refs.datepicker)
      .datepicker('remove')
      .datepicker({
        language: Language.get(),
        defaultViewDate: {
          month: 11,
          day: 24
        },
        startDate: moment().add(1, 'days').toDate(),
        weekStart: 1,
        startView: 1,
        title: () => _i18n.__(this.props.label),
        ...options
      })
      .on('changeDate', () => {
        var value = this.getValue();
        this.validate(value);
        this.onChange(value);
      });
  },

  componentDidMount() {
    _i18n.onChangeLocale(this.setDatepicker);
    this.setDatepicker();
  },

  componentWillUnmount() {
    _i18n.offChangeLocale(this.setDatepicker);
    $(this.refs.datepicker).datepicker('destroy');
  },

  render() {
    return (
      <div
        className={classNames({
          'with-title': this.props.label
        })}
        ref="datepicker"
      ></div>
    );
  }
});