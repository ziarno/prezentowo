Form = React.createClass({

  propTypes: {
    schema: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
  },

  getInitialState() {
    return {
      components: []
    };
  },

  childContextTypes: {
    register: React.PropTypes.func,
    schema: React.PropTypes.object,
    form: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      register: (inputComponent) => {
        this.state.components.push(inputComponent);
      },
      schema: this.props.schema,
      form: this
     };
  },

  reset() {
    $(ReactDOM.findDOMNode(this)).form('clear');
    this.state.components.forEach((component) => component.reset());
    this.props.schema.resetValidation();
  },

  submit(event) {
    event.preventDefault();
    var formValues = {};

    this.state.components.forEach((component) => (
      formValues[component.props.name] = component.getValue()
    ));

    if (_.isFunction(this.props.onSubmit)) {
      this.props.onSubmit(formValues);
    }
  },

  render() {
    return (
      <form
        className={classNames('ui form', this.props.className)}
        onSubmit={this.submit}
      >
        {this.props.children}
      </form>
    )
  }
});