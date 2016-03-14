import {Autorun} from '../../lib/Mixins';

FormErrorMessage = React.createClass({

  mixins: [Autorun],

  propTypes: {
    schema: React.PropTypes.object
  },

  getInitialState() {
    return {
      errors: []
    }
  },

  autorunGetErrorMessages() {
    this.setState({
      errors: this.props.schema.invalidKeys().map((key) => (
        this.props.schema.keyErrorMessage(key.name)
      ))
    });
  },

  render() {
    return (
      <Message
        hidden={this.props.schema.isValid()}
        className="form-popup--error icon attached fluid error"
        icon="warning"
        messages={this.state.errors}
      />
    );
  }

});