import React from 'react'
import {PopupComponent} from '../../../../lib/Mixins'
import {getAvatarImages} from '../../../../lib/utilities'

ParticipantPopup = class ParticipantPopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.initialGender = props.user ?
      props.user.profile.gender :
      Meteor.user().profile.gender
    this.state = _.extend(this.state, {
      images: getAvatarImages(this.initialGender),
      isSaving: false
    })
    this.schema = new SimpleSchema([
      Events.Schemas.NewParticipant,
      {
        sendEmail: {
          type: Boolean,
          optional: true
        }
      }
    ]).namedContext('newParticipant')

    this.reset = this.reset.bind(this)
    this.hideAndReset = this.hideAndReset.bind(this)
    this.submitParticipant = this.submitParticipant.bind(this)
    this.removeParticipant = this.removeParticipant.bind(this)
    this.redirectAfterParticipantRemove = this.redirectAfterParticipantRemove.bind(this)
    this.onUserSearchSelect = this.onUserSearchSelect.bind(this)
  }

  getPopupSettings() {
    var position = this.isEdit() ? 'bottom left' : 'bottom right'
    var transition = this.isEdit() ? 'scale' : 'slide down'
    return {
      onShow: () => {
        this.schema.resetValidation()
      },
      position,
      lastResort: position,
      transition
    }
  }

  addParticipant(participantData) {
    var eventId = Session.get('event')._id
    var participant = _.omit(participantData, 'sendEmail')
    var callback = () => {
      this.hideAndReset()
      this.setState({isSaving: false})
    }

    this.setState({isSaving: true})
    if (participantData.participantId) {
      Events.methods.addParticipantById.call({
        eventId,
        participantId: participantData.participantId
      }, callback)
    } else {
      Events.methods.addParticipant.call({
        eventId,
        sendEmail: participantData.sendEmail,
        participant
      }, callback)
    }
  }

  editParticipant(participantData) {
    var eventId = Session.get('event')._id

    participantData._id = this.props.user._id
    Events.methods.editParticipant.call({
      eventId,
      participantData
    })
    this.hideAndReset()
  }

  submitParticipant(participantData) {
    if (this.isEdit()) {
      this.editParticipant(participantData)
    } else {
      this.addParticipant(participantData)
    }
  }

  removeParticipant() {
    this.redirectAfterParticipantRemove()
    this.hideAndReset(() => {
      Events.methods.removeParticipant.call({
        eventId: Session.get('event')._id,
        participantId: this.props.user._id
      })
    })
  }

  redirectAfterParticipantRemove() {
    var event = Session.get('event')
    var user = Meteor.user()

    if (user.settings.viewMode.participantsMode === 'single' &&
      Session.get('currentUser')._id === this.props.user._id) {
      FlowRouter.go(`/event/id/${event._id}/user/${user._id}`)
    }
  }

  setBeneficiary(action) {
    var methodName = action ? 'addBeneficiary' : 'removeBeneficiary'
    this.hidePopup(() => {
      this.reset()
      Events.methods[methodName].call({
        eventId: Session.get('event')._id,
        participantId: this.props.user._id
      })
    })
  }

  mapToFormData(user) {
    return user && {
      _id: user._id,
      ...user.profile,
      email: user.registered_emails && user.registered_emails[0].address
    }
  }

  onUserSearchSelect(user) {
    this.refs.form
      .setFormData(this.mapToFormData(user))
      .setDisabled(true)
      .setHiddenFields({
        participantId: user._id
      })
  }

  isEdit() {
    return !!this.props.user
  }

  renderTrigger() {
    return (
      <div
        ref="popupTrigger"
        onClick={this.showPopup}
        className={classNames(
          'ui compact icon button',
          'waves-effect waves-button',
          this.props.buttonClassName)}>
        {this.props.icon}
      </div>
    )
  }

  renderPopup() {
    var isEdit = this.isEdit()
    var event = Session.get('event')
    var showBeneficiaryButton = isEdit &&
      event.type === 'many-to-one'
    var isBeneficiary = this.props.user &&
      event.beneficiaryIds.indexOf(this.props.user._id) > -1

    return (
      <div
        ref="popupTarget"
        className={classNames(
          'participant-popup form-popup ui flowing popup',
          this.props.popupClassName
        )}>
        <Form
          ref="form"
          disabled={this.props.user && !this.props.user.isTemp}
          data={this.mapToFormData(this.props.user)}
          onSubmit={this.submitParticipant}
          schema={this.schema}>

          <div className={classNames(
            'form-popup--title ui attached message',
            {'with-button': showBeneficiaryButton}
          )}>
            {isEdit ? (
              <div className="header">
                <T>Edit participant</T>
                {showBeneficiaryButton ? (
                  <button
                    type="button"
                    onClick={() => this.setBeneficiary(!isBeneficiary)}
                    className="ui compact icon left labeled button">
                    <i className={classNames({
                      plus: !isBeneficiary,
                      minus: isBeneficiary
                    }, 'icon')} />
                    {isBeneficiary ? (
                      <T>Remove as beneficiary</T>
                    ) : (
                      <T>Add as beneficiary</T>
                    )}
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="header">
                <T>New participant</T>
              </div>
            )}
          </div>

          <div
            className="form-popup--form flex ui form attached fluid segment">
            <ImagePicker
              name="pictureUrl"
              images={this.state.images}
              uploadOptions={{
                folder: 'users',
                transformation: 'avatar-large'
              }}
            />
            <div className="form-popup--form-right" >
              {isEdit ? (
                <Input
                  name="name"
                  placeholder="Fullname"
                />
              ) : (
                <SearchableInput
                  name="name"
                  placeholder="Fullname"
                  search={new SearchSource('usernames', ['profile.name'])}
                  onSearchSelect={this.onUserSearchSelect}
                />
              )}
              {isEdit ? (
                <Input
                  name="email"
                  placeholder="hints.EmailOptional">
                </Input>
              ) : (
                <SearchableInput
                  name="email"
                  placeholder="hints.EmailOptional"
                  search={new SearchSource('email', ['registered_emails'])}
                  onSearchSelect={this.onUserSearchSelect}>
                  <CheckboxInput
                    name="sendEmail"
                    className="invitation-email-checkbox"
                    label="Send invitation email"
                    checked
                  />
                </SearchableInput>
              )}
              <SelectInput
                placeholder="Gender"
                name="gender"
                selectDefault={this.initialGender}
                onChange={({gender}) =>
                  this.setState({images: getAvatarImages(gender)})
                }>
                <div className="item" data-value="male">
                  <i className="man icon"></i>
                  <T>Male</T>
                </div>
                <div className="item" data-value="female">
                  <i className="woman icon"></i>
                  <T>Female</T>
                </div>
              </SelectInput>
            </div>
          </div>

          <FormErrorMessage />

          <FormActionButtons
            showRemove={isEdit}
            removeIcon="remove user"
            acceptButtonText={isEdit ? 'Save' : 'Add participant'}
            onRemove={this.removeParticipant}
            onCancel={this.hideAndReset}
            isSaving={this.state.isSaving}
          />

        </Form>
      </div>
    )
  }

}

ParticipantPopup.propTypes = {
  user: React.PropTypes.object,
  buttonClassName: React.PropTypes.string,
  popupClassName: React.PropTypes.string,
  icon: React.PropTypes.element,
  onRemove: React.PropTypes.func
}