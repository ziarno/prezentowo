import {InputValidation} from '../../../lib/Mixins';

SelectInput = React.createClass({

  mixins: [InputValidation],

  propTypes: {
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    label: React.PropTypes.string,
    name: React.PropTypes.string
  },

  componentDidMount() {
    var $dropdown = $(this.refs.dropdown);

    $dropdown.dropdown({
      action(text, value) {
        var $placeholder = $dropdown.find('.text');
        var node = $(this);
        var nodeString;

        node
          .addClass('active selected')
          .find('*')
          .removeAttr('data-reactid');
        nodeString = node.html();
        $placeholder.removeClass('default');

        $(this).siblings().removeClass('active selected');
        ReactDOM.render(
          <div dangerouslySetInnerHTML={{__html: nodeString}} />,
          $placeholder[0]
        );
        $dropdown
          .dropdown('hide') //note: hide before set value, because error
          .dropdown('set value', value);
      },
      onChange: (value) => {
        this.validate(value);
        this.onChange(value);
      },
      onShow: () => this.hideError(),
      onHide: () => this.showError()
    });
  },

  getValue() {
    return $(this.refs.dropdown).dropdown('get value');
  },

  reset() {
    $(this.refs.dropdown).dropdown('clear');
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

        <div className="default text">
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