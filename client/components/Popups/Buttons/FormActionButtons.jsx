import React, { Component, PropTypes } from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

FormActionButtons = class FormActionButtons extends Component {

  constructor() {
    super()
    this.state = {
      showDeleteConfirmation: false
    }
  }

  render() {
    const {
      removeText,
      removeIcon,
      onRemove,
      onCancel,
      onAccept,
      showRemove,
      isSaving,
      acceptIcon,
      acceptButtonText = 'Save'
    } = this.props
    const {
      showDeleteConfirmation
    } = this.state

    const Buttons = {
      hideDeleteConfirmation: (
        <ButtonBack
          key="form-action-button-back"
          onClick={() => this.setState({ showDeleteConfirmation: false })}
        />
      ),
      showDeleteConfirmation: (
        <ButtonRemove
          key="form-action-button-show-delete"
          text={removeText}
          icon={removeIcon}
          onClick={() => this.setState({ showDeleteConfirmation: true })}
        />
      ),
      remove: (
        <ButtonRemove
          key="form-action-button-hide-delete"
          text={removeText}
          icon={removeIcon}
          onClick={onRemove}
        />
      ),
      cancel: (
        <ButtonCancel
          key="form-action-button-cancel"
          onClick={onCancel}
        />
      ),
      accept: (
        <ButtonAccept
          key="form-action-button-accept"
          isLoading={isSaving}
          onClick={onAccept}
          icon={acceptIcon}
          text={acceptButtonText}
        />
      )
    }
    const buttons = showDeleteConfirmation ?
      [
        Buttons.hideDeleteConfirmation,
        Buttons.remove
      ] :
      [
        Buttons.cancel,
        showRemove ? Buttons.showDeleteConfirmation : null,
        Buttons.accept
      ]

    return (
      <div
        className={classNames('ui bottom attached message bottom-modal-buttons', {
          error: showDeleteConfirmation
        })}
      >
        {showDeleteConfirmation ?
          <T>hints.deleteConfirmation</T>
        : null}

        <div className="ui buttons">
          {buttons}
        </div>
      </div>
    )
  }

}

FormActionButtons.propTypes = {
  showRemove: PropTypes.bool,
  isSaving: PropTypes.bool,
  acceptButtonText: PropTypes.string,
  removeIcon: PropTypes.string,
  acceptIcon: PropTypes.string,
  removeText: PropTypes.string,
  onRemove: PropTypes.func,
  onAccept: PropTypes.func,
  onCancel: PropTypes.func
}
