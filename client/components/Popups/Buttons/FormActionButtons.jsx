FormActionButtons = class FormActionButtons extends React.Component {

  constructor() {
    super()
    this.state = {
      showDeleteConfirmation: false
    }
  }

  render() {
    if (this.state.showDeleteConfirmation) {
      return (
        <div className="ui bottom attached error message actions flex">
          <T>hints.deleteConfirmation</T>
          <div className="ui buttons">
            <ButtonBack
              onClick={() => this.setState({showDeleteConfirmation: false})}
            />
            <ButtonRemove
              onClick={this.props.onRemove}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="ui bottom attached message actions flex">
        <div className="ui buttons">
          <ButtonCancel
            onClick={this.props.onCancel}
          />
          {this.props.showRemove ? (
            <ButtonRemove
              onClick={() => this.setState({showDeleteConfirmation: true})}
            />
          ) : null}
          <ButtonAccept
            onClick={this.props.onAccept}
            text={this.props.acceptButtonText || 'Save'}
          />
        </div>
      </div>
    )
  }

}

FormActionButtons.propTypes = {
  showRemove: React.PropTypes.bool,
  acceptButtonText: React.PropTypes.string,
  onRemove: React.PropTypes.func.isRequired,
  onAccept: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
}