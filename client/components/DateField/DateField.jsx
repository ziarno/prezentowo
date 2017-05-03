import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import reactMixin from 'react-mixin'
import {
  Tooltips,
  RefreshOnLocaleChange
} from '../../../lib/Mixins'

DateField = class DateField extends Component {

  constructor() {
    super()
    this.hideTooltips = this.hideTooltips.bind(this)
    this.setTooltips = this.setTooltips.bind(this)
  }

  static getRalationalTime({date, roundToDays}) {
    let dateText = moment(date).from(new Date())
    const startOfToday = moment().startOf('day')
    const startOfDate = moment(date).startOf('day')
    const daysDiff = startOfDate.diff(startOfToday, 'days')
    const days = {
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
    const dateText = this.props.mode === 'from' ?
      DateField.getFormattedDate(this.props) :
      DateField.getRalationalTime(this.props)

    return {
      dateField: {
        content: dateText
      }
    }
  }

  render() {
    const dateText = this.props.mode !== 'from' ?
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
  date: PropTypes.instanceOf(Date).isRequired,
  className: PropTypes.string,
  roundToDays: PropTypes.bool,
  mode: PropTypes.oneOf([
    'date', 'from'
  ])
}

reactMixin(DateField.prototype, Tooltips)
reactMixin(DateField.prototype, RefreshOnLocaleChange)
