import {InputValidation} from '../../../lib/Mixins';

SelectInput = React.createClass({

  mixins: [InputValidation],

  propTypes: {
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    label: React.PropTypes.string,
    name: React.PropTypes.string,
    selectDefault: React.PropTypes.string
  },

  getInitialState() {
    return {
      isSelectedByUser: false
    }
  },

  setSelected(value) {
    if (!value) {
      return;
    }

    //note: item selection must be done manually with react, because semantic does DOM manipulation on its own otherwise and it ends up cloning elements with the same reactid
    var $dropdown = $(this.refs.dropdown);
    var $node = $dropdown.dropdown('get item', value);
    var $nodeCloned = $($.clone($node[0]));
    var nodeString;

    $nodeCloned
      .find('*')
      .removeAttr('data-reactid');
    nodeString = $nodeCloned.html();
    $(this.refs.placeholder).removeClass('default');

    $node
      .addClass('active selected')
      .siblings()
      .removeClass('active selected');
    ReactDOM.render(
      <div dangerouslySetInnerHTML={{__html: nodeString}} />,
      this.refs.placeholder
    );
    $dropdown.dropdown('set value', value);
  },

  selectDefault(value) {
    if (value && !this.state.isSelectedByUser) {
      this.setSelected(value);
    }
  },

  getValue() {
    return $(this.refs.dropdown).dropdown('get value');
  },

  reset() {
    this.setState(this.getInitialState());
    $(this.refs.dropdown).dropdown('clear');
  },

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps);
  },

  componentWillReceiveProps({selectDefault}) {
    this.selectDefault(selectDefault);
  },

  componentDidMount() {
    var $dropdown = $(this.refs.dropdown);

    function scrollCurrentIntoView(value) {
      var value = $dropdown.dropdown('get value');
      var $item = $dropdown.dropdown('get item', value);

      if ($item) {
        setTimeout(() => {
          if (_.isFunction($item[0].scrollIntoViewIfNeeded)) {
            $item[0].scrollIntoViewIfNeeded(true);
          } else {
            $item[0].scrollIntoView();
          }
        }, 300);
      }
    }

    $dropdown.dropdown({
      action: (nodeString, value) => {
        $dropdown.dropdown('hide'); //note: hide before set value, because error
        this.setSelected(value);
        this.setState({isSelectedByUser: true});
      },
      onChange: (value) => {
        this.validate(value);
        this.onChange(value);
      },
      onShow: () => {
        scrollCurrentIntoView();
        this.hideError();
      },
      onHide: () => this.showError()
    });

    this.selectDefault(this.props.selectDefault);
  },

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
          {this.props.placeholder}
        </div>

        <i className="dropdown icon"></i>

        <div className="menu">
          {this.props.children}
        </div>

      </div>
    );
  }
});