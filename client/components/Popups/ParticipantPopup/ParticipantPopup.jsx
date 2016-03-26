import {PopupComponent, Autorun} from '../../../../lib/Mixins'
import reactMixin from 'react-mixin'

ParticipantPopup = class ParticipantPopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.initialGender = props.user ?
      props.user.profile.gender :
      Meteor.user().profile.gender
    this.state = _.extend(this.state, {
      showDeleteConfirmation: false,
      images: this.getImagesForGender(this.initialGender),
      isSaving: false
    })
    this.schema = Events.Schemas.NewParticipant
      .namedContext('newParticipant')

    this.reset = this.reset.bind(this)
    this.hideAndReset = this.hideAndReset.bind(this)
    this.updateImages = this.updateImages.bind(this)
    this.getImagesForGender = this.getImagesForGender.bind(this)
    this.submitParticipant = this.submitParticipant.bind(this)
    this.removeParticipant = this.removeParticipant.bind(this)
  }

  getPopupSettings() {
    var position = this.isEdit() ? 'bottom left' : 'top right'
    var transition = this.isEdit() ? 'scale' : 'slide down'
    return {
      onShow: () => {
        this.schema.resetValidation()
        this.setState({showDeleteConfirmation: false})
      },
      position,
      lastResort: position,
      transition
    }
  }

  updateImages({gender}) {
    this.setState({images: this.getImagesForGender(gender)})
  }

  getImagesForGender(gender) {
    var avatarsCount = 12
    var fileLetterName = gender === 'female' ? 'f' : 'm'
    return _.range(avatarsCount).map((index) => (
      `/images/avatars/${fileLetterName}${index + 1}.png`
    ))
  }

  submitParticipant(formData) {
    if (!this.schema.validate(_.omit(formData, 'sendEmail'))) {
      return
    }

    var eventId = Session.get('event')._id
    var participant = _.omit(formData, 'sendEmail')

    if (this.isEdit()) {
      participant._id = this.props.user._id
      Events.methods.editParticipant.call({
        eventId,
        participant
      })
      this.hideAndReset()
    } else {
      this.setState({isSaving: true})
      Events.methods.addParticipant.call({
        eventId,
        sendEmail: formData.sendEmail,
        participant
      }, () => {
        this.hideAndReset()
        this.setState({isSaving: false})
      })
    }
  }

  removeParticipant() {
    this.hidePopup(() => {
      Events.methods.removeParticipant.call({
        eventId: Session.get('event')._id,
        participantId: this.props.user._id
      })
    })
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

  isEdit() {
    return !!this.props.user
  }

  renderTrigger() {
    return (
      <div
        onClick={this.showPopup}
        className={classNames('ui compact icon button waves-effect',
            this.props.buttonClassName)}
        ref="popupTrigger">
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
        className="participant-popup form-popup ui flowing popup">
        <Form
          ref="form"
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
              <Input
                name="name"
                placeholder="Fullname"
              />
              <Input
                name="email"
                placeholder="hints.EmailOptional"
                type="email">
                {!isEdit ? (
                  <CheckboxInput
                    name="sendEmail"
                    className="invitation-email-checkbox"
                    label="Send invitation email"
                    checked
                  />
                ) : null}
              </Input>
              <SelectInput
                placeholder="Gender"
                name="gender"
                selectDefault={this.initialGender}
                onChange={this.updateImages}>
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
            acceptButtonText={isEdit ? 'Save' : 'Add participant'}
            onRemove={this.removeParticipant}
            onCancel={this.hideAndReset}
            onAccept={(e) => this.refs.form.submitForm(e)}
          />

        </Form>
      </div>
    )
  }

}

reactMixin(ParticipantPopup.prototype, Autorun)

ParticipantPopup.propTypes = {
  user: React.PropTypes.object,
  buttonClassName: React.PropTypes.string,
  icon: React.PropTypes.element
}