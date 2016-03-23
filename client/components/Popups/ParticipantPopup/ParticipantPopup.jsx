import {Popup} from '../../../../lib/Mixins'
import reactMixin from 'react-mixin'

ParticipantPopup = class ParticipantPopup extends React.Component {

  constructor(props) {
    super(props)
    var initialGender = props.user ?
      props.user.profile.gender : 'male'

    this.state = {
      showDeleteConfirmation: false,
      images: this.getImagesForGender(initialGender),
      isSaving: false
    }
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
    return {
      onShow: () => {this.schema.resetValidation()},
      position: 'bottom right',
      lastResort: 'bottom right',
      transition: 'slide down'
    }
  }

  reset() {
    this.state = {
      showDeleteConfirmation: false
    }
    this.refs.form && this.refs.form.reset()
  }

  hideAndReset() {
    this.hidePopup(this.reset)
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

  render() {

    var Popup = (
      <div
        ref="popup"
        className="ui flowing popup form-popup participant-popup">

        <div className="ui attached message">
          <div className="header">
            {this.isEdit() ? (
              <T>Edit participant</T>
            ) : (
              <T>New participant</T>
            )}
          </div>
        </div>

        <Form
          ref="form"
          data={this.mapToFormData(this.props.user)}
          className="form-popup--form flex attached fluid segment"
          onSubmit={this.submitParticipant}
          schema={this.schema}>
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
        </Form>

        <FormErrorMessage schema={this.schema} />

        {this.state.showDeleteConfirmation ? (
          <div className="ui bottom attached error message actions">
            <T>hints.deleteConfirmation</T>
            <div className="ui buttons">
              <button
                className="ui labeled icon button"
                onClick={() => this.setState({showDeleteConfirmation: false})}>
                <i className="caret left icon"></i>
                <T>Back</T>
              </button>
              <button
                className="ui labeled icon red button"
                onClick={this.removeParticipant}>
                <i className="trash icon"></i>
                <T>Delete</T>
              </button>
            </div>
          </div>
        ) : (
          <div className="ui bottom attached message actions">
            <div className="ui buttons">
              <button
                className="ui labeled icon button"
                onClick={this.hideAndReset}>
                <i className="remove icon"></i>
                <T>Cancel</T>
              </button>
              {this.isEdit() ? (
                <button
                  className="ui labeled icon red button"
                  onClick={() => this.setState({showDeleteConfirmation: true})}>
                  <i className="trash icon"></i>
                  <T>Delete</T>
                </button>
              ) : null}
              <button
                className={classNames('ui labeled icon primary button', {
                  loading: this.state.isSaving
                })}
                onClick={(e) => this.refs.form.submitForm(e)}>
                <i className="checkmark icon"></i>
                {this.isEdit() ? (
                  <T>Save</T>
                ) : (
                  <T>Add participant</T>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    )

    return (
      <div className={this.props.wrapperClassName}>
        <div
          className={classNames('ui compact icon button waves-effect',
            this.props.buttonClassName)}
          ref="popupTrigger">
          <i className={classNames(this.props.icon, 'icon')} />
        </div>
        {Popup}
      </div>
    )

  }
}

ParticipantPopup.contextTypes = {
  user: React.PropTypes.object,
  eventId: React.PropTypes.string,
  wrapperClassName: React.PropTypes.string,
  buttonClassName: React.PropTypes.string,
  icon: React.PropTypes.string
}

reactMixin(ParticipantPopup.prototype, Popup)