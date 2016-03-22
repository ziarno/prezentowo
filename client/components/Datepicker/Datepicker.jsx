import {ValidatedInput, RefreshOnLocaleChange} from '../../../lib/Mixins'
import moment from 'moment'

Datepicker = class Datepicker extends ValidatedInput {

  constructor() {
    super()
    this.reset = this.reset.bind(this)
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.setDatepicker = this.setDatepicker.bind(this)
  }

  reset() {
    this.setDatepicker()
  }

  getValue() {
    return $(this.refs.datepicker).datepicker('getDate')
  }

  setValue(value) {
    this.setDatepicker({startView: 0})
    $(this.refs.datepicker)
      .datepicker('setDate', value)
  }

  setDatepicker(options) {
    $(this.refs.datepicker)
      .off('changeDate')
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
        var value = this.getValue()
        this.validate(value)
        this.onChange(value)
      })
  }

  componentDidMount() {
    super.componentDidMount()
    _i18n.onChangeLocale(this.setDatepicker)
    this.setDatepicker()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    _i18n.offChangeLocale(this.setDatepicker)
    $(this.refs.datepicker)
      .off('changeDate')
      .datepicker('destroy')
  }

  render() {
    return (
      <div
        className={classNames({
          'with-title': this.props.label
        })}
        ref="datepicker"
      ></div>
    )
  }
}

Datepicker.propTypes = {
  label: React.PropTypes.string
}