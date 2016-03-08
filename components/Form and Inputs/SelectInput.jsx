import {InputValidation} from '../../lib/Mixins';

SelectInput = React.createClass({

  mixins: [InputValidation],

  propTypes: {
    placeholder: React.PropTypes.string
  },

  componentDidMount() {
    var $dropdown = $(this.refs.dropdown);

    $dropdown.dropdown({
      action(text, value) {
        var nodeString = $(this)
          .addClass('active selected')
          .children()
          .removeAttr('data-reactid')
          .parent()
          .html();
        var $placeholder = $dropdown.find('.text');
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
        className={classNames('ui fluid selection dropdown', this.props.className, {
          error: this.shouldShowError()
        })}>

        {this.props.placeholder ? (
          <div className="default text">
            {this.props.placeholder}
          </div>
        ) : null}

        <i className="dropdown icon"></i>

        <div className="menu">
          {this.props.children}
        </div>

      </div>
    );
  }
});