import {Autorun} from '../../../lib/Mixins';

/**
 * Form
 *
 * Use the register() method in child components
 * provided by the context to register inputs
 *
 * Requires:
 * - child input components that are registered must provide
 *   reset() and getValue() methods
 */
Form = React.createClass({

  mixins: [Autorun],

  propTypes: {
    schema: React.PropTypes.object.isRequired,
    className: React.PropTypes.string,
    onSubmit: React.PropTypes.func
  },

  childContextTypes: {
    register: React.PropTypes.func,
    schema: React.PropTypes.object,
    form: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      register: (inputComponent) => {
        if (!_.isFunction(inputComponent.getValue) ||
            !_.isFunction(inputComponent.getValue)) {
          throw new Error(`${inputComponent.constructor.displayName} component must have a getValue() and reset() methods in order to be registered as an input in the Form component`);
        }
        this.state.components.push(inputComponent);
      },
      schema: this.props.schema,
      form: this
     };
  },

  getInitialState() {
    return {
      components: [],
      hasError: false
    };
  },

  autorunSetError() {
    this.setState({
      hasError: !this.props.schema.isValid()
    });
  },

  reset() {
    $(ReactDOM.findDOMNode(this)).form('clear');
    this.state.components.forEach((component) => component.reset());
    this.props.schema.resetValidation();
  },

  submitForm(event) {
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
        className={classNames('ui form', this.props.className, {
          error: this.state.hasError
        })}
        onSubmit={this.submitForm}
      >
        {this.props.children}
      </form>
    )
  }
});