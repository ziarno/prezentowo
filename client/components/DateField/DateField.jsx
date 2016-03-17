import moment from 'moment';
import {Tooltips} from '../../../lib/Mixins';

DateField = React.createClass({

  mixins: [Tooltips],

  getTooltips() {
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

    return {
      dateField: {
        position: 'right center',
        variation: 'mini',
        delay: {
          show: 100,
          hide: 0
        },
        content: dateText
      }
    };
  },

  render() {
    return (
      <span
        className={this.props.className}
        onClick={this.hideTooltips}
        onMouseEnter={this.setTooltips}
        ref="dateField">

        {moment(this.props.date).format('L')}
      </span>
    );
  }
});