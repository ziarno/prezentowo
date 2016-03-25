import {Autorun} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

FormErrorMessage = class FormErrorMessage extends React.Component {

  constructor() {
    super()
    this.state = {
      errors: []
    }
    this.autorunGetErrorMessages = this.autorunGetErrorMessages.bind(this)
  }
  
  autorunGetErrorMessages() {
    this.setState({
      errors: this.context.schema.invalidKeys().map((key) => (
        this.context.schema.keyErrorMessage(key.name)
      ))
    })
  }

  render() {
    return (
      <Message
        hidden={!this.state.errors.length}
        className="form-popup--error icon attached fluid error"
        icon="warning"
        messages={this.state.errors}
      />
    )
  }

}

FormErrorMessage.contextTypes = {
  schema: React.PropTypes.object
}

reactMixin(FormErrorMessage.prototype, Autorun)