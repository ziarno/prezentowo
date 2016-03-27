import {ValidatedInput} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

SelectInput = class SelectInput extends ValidatedInput {

  constructor() {
    super()
    this.state = _.extend(this.getDefaultState(), {
      isSelectedByUser: false
    })
    this.setValue = this.setValue.bind(this)
    this.selectDefault = this.selectDefault.bind(this)
    this.getValue = this.getValue.bind(this)
    this.reset = this.reset.bind(this)
  }

  setValue(value) {
    //note: item selection must be done manually with react, because semantic does DOM manipulation on its own otherwise and it ends up cloning elements with the same reactid
    var $dropdown = $(this.refs.dropdown)
    var $node = $dropdown.dropdown('get item', value)
    var $nodeCloned

    if (!value || !($node instanceof jQuery)) {
      return
    }

    $nodeCloned = $($.clone($node[0]))

    $nodeCloned
      .find('*')
      .removeAttr('data-reactid')
    $(this.refs.placeholder).removeClass('default')

    $node
      .addClass('active selected')
      .siblings()
      .removeClass('active selected')
    ReactDOM.unmountComponentAtNode(this.refs.placeholder)
    ReactDOM.render(
      <div dangerouslySetInnerHTML={{__html: $nodeCloned.html()}} />,
      this.refs.placeholder
    )
    $dropdown.dropdown('set value', value)
  }

  selectDefault(value) {
    if (value &&
      !this.state.isSelectedByUser &&
      value !== this.getValue()) {
      this.setValue(value)
    }
  }

  getValue() {
    return $(this.refs.dropdown).dropdown('get value')
  }

  reset() {
    $(this.refs.dropdown).dropdown('clear')
    this.setState({
      isSelectedByUser: false
    })
    this.selectDefault(this.props.selectDefault)
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  componentWillReceiveProps({selectDefault}) {
    this.selectDefault(selectDefault)
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.refs.placeholder)
  }

  componentDidMount() {
    super.componentDidMount()
    var $dropdown = $(this.refs.dropdown)

    function scrollCurrentIntoView() {
      var value = $dropdown.dropdown('get value')
      var $item = $dropdown.dropdown('get item', value)

      if ($item) {
        setTimeout(() => {
          if (_.isFunction($item[0].scrollIntoViewIfNeeded)) {
            $item[0].scrollIntoViewIfNeeded(true)
          }
        }, 300)
      }
    }

    $dropdown.dropdown({
      action: (nodeString, value) => {
        $dropdown.dropdown('hide')
        this.setState({isSelectedByUser: true}) //note: setState before setValue, because causes am update after setting a value -> which causes the value to be set as default
        this.setValue(value)
      },
      onChange: (value) => {
        this.validate(value)
        this.onChange(value)
      },
      onShow: () => {
        scrollCurrentIntoView()
        this.hideError()
      },
      onHide: () => this.showError()
    })

    this.selectDefault(this.props.selectDefault)
  }

  render() {
    return (
      <div
        ref="dropdown"
        className={classNames('ui dropdown', this.props.className, {
          'fluid selection': !this.props.inline,
          inline: this.props.inline,
          error: this.shouldShowError()
        })}>

        <div
          ref="placeholder"
          className="default text">
          {_i18n.__(this.props.placeholder)}
        </div>

        <i className="dropdown icon"></i>

        <div className="menu">
          {this.props.children}
        </div>

      </div>
    )
  }
}

SelectInput.propTypes = {
  placeholder: React.PropTypes.string,
  className: React.PropTypes.string,
  selectDefault: React.PropTypes.string
}