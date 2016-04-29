import React from 'react'
import moment from 'moment'
import {Tooltips, RefreshOnLocaleChange} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

DateField = class DateField extends React.Component {

  constructor() {
    super()
    this.hideTooltips = this.hideTooltips.bind(this)
    this.setTooltips = this.setTooltips.bind(this)
  }

  static getRalationalTime({date, roundToDays}) {
    var dateText = moment(date).from(new Date())
    var startOfToday = moment().startOf('day')
    var startOfDate = moment(date).startOf('day')
    var daysDiff = startOfDate.diff(startOfToday, 'days')
    var days = {
      '0': _i18n.__('today'),
      '-1': _i18n.__('yesterday'),
      '1': _i18n.__('tomorrow')
    }

    if (roundToDays && Math.abs(daysDiff) <= 1) {
      dateText = days[daysDiff]
    }

    return dateText
  }

  static getFormattedDate({date, roundToDays}) {
    return moment(date).format(roundToDays ? 'L' : 'L LT')
  }

  getTooltips() {
    var dateText = this.props.mode === 'from' ?
      DateField.getFormattedDate(this.props) :
      DateField.getRalationalTime(this.props)

    return {
      dateField: {
        content: dateText
      }
    }
  }

  render() {
    var dateText = this.props.mode !== 'from' ?
      DateField.getFormattedDate(this.props) :
      DateField.getRalationalTime(this.props)

    return (
      <span
        className={this.props.className}
        onClick={this.hideTooltips}
        onMouseEnter={this.setTooltips}
        ref="dateField">

        {dateText}
      </span>
    )
  }

}

DateField.propTypes = {
  date: React.PropTypes.instanceOf(Date).isRequired,
  className: React.PropTypes.string,
  roundToDays: React.PropTypes.bool,
  mode: React.PropTypes.oneOf([
    'date', 'from'
  ])
}

reactMixin(DateField.prototype, Tooltips)
reactMixin(DateField.prototype, RefreshOnLocaleChange)