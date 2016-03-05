SelectInput = React.createClass({

  mixins: [InputValidationMixin],

  propTypes: {
    placeholder: React.PropTypes.string
  },

  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).dropdown({
      onChange: (value) => {
        this.validate(value);
        if (_.isFunction(this.props.onChange)) {
          this.props.onChange({
            [this.props.name]: value
          });
        }
      },
      onShow: () => this.hideError(),
      onHide: () => this.showError()
    });
  },

  render() {
    return (
      <div
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