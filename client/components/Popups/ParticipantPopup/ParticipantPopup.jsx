import {PopupComponent} from '../../../../lib/Mixins'

ParticipantPopup = class ParticipantPopup extends PopupComponent {

  constructor(props) {
    super(props)
    var initialGender = props.user ?
      props.user.profile.gender : 'male'

    this.state = _.extend(this.state, {
      showDeleteConfirmation: false,
      images: this.getImagesForGender(initialGender),
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
    var position = this.isEdit() ? 'right center' : 'top right'
    return {
      onShow: () => {
        this.schema.resetValidation()
        this.setState({showDeleteConfirmation: false})
      },
      position,
      lastResort: position,
      transition: 'slide down'
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

    var eventId = FlowRouter.getParam('eventId')
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
    Events.methods.removeParticipant.call({
      eventId: FlowRouter.getParam('eventId'),
      participantId: this.props.user._id
    })
    this.hidePopup()
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
    return (
      <div
        ref="popupTarget"
        className="participant-popup form-popup ui flowing popup">
        <Form
          ref="form"
          data={this.mapToFormData(this.props.user)}
          onSubmit={this.submitParticipant}
          schema={this.schema}>

          <div className="ui attached message">
            <div className="header">
              {this.isEdit() ? (
                <T>Edit participant</T>
              ) : (
                <T>New participant</T>
              )}
            </div>
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
                {!this.isEdit() ? (
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
            showRemove={this.isEdit()}
            acceptButtonText={this.isEdit() ? 'Save' : 'Add participant'}
            onRemove={this.removeParticipant}
            onCancel={this.hideAndReset}
            onAccept={(e) => this.refs.form.submitForm(e)}
          />

        </Form>
      </div>
    )
  }

}

ParticipantPopup.propTypes = {
  user: React.PropTypes.object,
  buttonClassName: React.PropTypes.string,
  icon: React.PropTypes.element
}