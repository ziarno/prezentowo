import {Popup} from '../../../../lib/Mixins'
import reactMixin from 'react-mixin'

ParticipantPopup = class ParticipantPopup extends React.Component {

  constructor() {
    super()
    this.schema = Events.Schemas.NewParticipant
      .namedContext('newParticipant')
    this.state = {
      images: this.getImagesForGender('male'),
      isSaving: false
    }
    this.reset = this.reset.bind(this)
    this.hideAndReset = this.hideAndReset.bind(this)
    this.updateImages = this.updateImages.bind(this)
    this.getImagesForGender = this.getImagesForGender.bind(this)
    this.addParticipant = this.addParticipant.bind(this)
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
    this.refs.form.reset()
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

  addParticipant(formData) {
    if (this.schema.validate(_.omit(formData, 'sendEmail'))) {
      this.setState({isSaving: true})
      Events.methods.addParticipant.call({
        eventId: FlowRouter.getParam('eventId'),
        sendEmail: formData.sendEmail,
        participant: _.omit(formData, 'sendEmail')
      }, () => {
        this.hideAndReset()
        this.setState({isSaving: false})
      })
    }
  }

  render() {

    var Popup = (
      <div
        ref="popup"
        className="ui flowing popup form-popup participant-popup">

        <div className="ui attached message">
          <div className="header">
            <T>New participant</T>
          </div>
        </div>

        <Form
          ref="form"
          className="form-popup--form flex attached fluid segment"
          onSubmit={this.addParticipant}
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
              <CheckboxInput
                name="sendEmail"
                className="invitation-email-checkbox"
                label="Send invitation email"
                checked
              />
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

        <div className="ui bottom attached message actions">
          <div className="ui buttons">
            <button
              className="ui labeled icon button"
              onClick={this.hideAndReset}>
              <i className="remove icon"></i>
              <T>Cancel</T>
            </button>
            <button
              className={classNames('ui labeled icon primary button', {
                loading: this.state.isSaving
              })}
              onClick={(e) => this.refs.form.submitForm(e)}>
              <i className="checkmark icon"></i>
              <T>Add participant</T>
            </button>
          </div>
        </div>

      </div>
    )

    return (
      <div
        className="ui icon button waves-effect waves-button"
        ref="popupTrigger">
        <i className="add user icon"/>
        {Popup}
      </div>
    )

  }
}

ParticipantPopup.contextTypes = {
  eventId: React.PropTypes.string
}

reactMixin(ParticipantPopup.prototype, Popup)