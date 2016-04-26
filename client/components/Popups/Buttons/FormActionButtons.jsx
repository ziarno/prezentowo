import React from 'react'

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
        <div className="ui bottom attached error message bottom-modal-buttons">
          <T>hints.deleteConfirmation</T>
          <div className="ui buttons">
            <ButtonBack
              onClick={() => this.setState({showDeleteConfirmation: false})}
            />
            <ButtonRemove
              icon={this.props.removeIcon}
              onClick={this.props.onRemove}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="ui bottom attached message bottom-modal-buttons ">
        <div className="ui buttons">
          <ButtonCancel
            onClick={this.props.onCancel}
          />
          {this.props.showRemove ? (
            <ButtonRemove
              icon={this.props.removeIcon}
              onClick={() => this.setState({showDeleteConfirmation: true})}
            />
          ) : null}
          <ButtonAccept
            isLoading={this.props.isSaving}
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
  isSaving: React.PropTypes.bool,
  acceptButtonText: React.PropTypes.string,
  removeIcon: React.PropTypes.string,
  onRemove: React.PropTypes.func,
  onAccept: React.PropTypes.func,
  onCancel: React.PropTypes.func
}