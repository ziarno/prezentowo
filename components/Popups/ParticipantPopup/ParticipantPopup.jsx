import {Popup} from '../../../lib/Mixins';

ParticipantPopup = React.createClass({

  mixins: [Popup],

  getPopupSettings() {
    return {
      onHide: () => this.schema.resetValidation()
    };
  },

  getInitialState() {
    return {
      images: [],
      isSaving: false
    };
  },

  contextTypes: {
    eventId: React.PropTypes.string
  },

  reset() {
    this.refs.form.reset();
  },

  hideAndReset() {
    this.hidePopup(this.reset);
  },

  updateImages({gender}) {
    var avatarsCount = 12;
    var fileLetterName = gender === 'female' ? 'f' : 'm';
    var avatars = _.range(avatarsCount).map((index) => (
      `/images/avatars/${fileLetterName}${index + 1}.png`
    ));
    this.setState({images: avatars});
  },

  addParticipant(formData) {
    if (this.schema.validate(_.omit(formData, 'sendEmail'))) {
      this.setState({isSaving: true});
      Events.methods.addParticipant.call({
        eventId: this.context.eventId,
        sendEmail: formData.sendEmail,
        participant: _.omit(formData, 'sendEmail')
      }, () => {
        this.hideAndReset();
        this.setState({isSaving: false});
      });
    }
  },

  componentDidMount() {
    this.updateImages({gender: 'male'});
  },

  render() {
    this.schema = this.schema || Events.Schemas.NewParticipant
        .namedContext('newParticipant');

    var AddParticipantButton = (
      <div
        ref="popupTrigger"
        className={`user-list--add-participant-button
                  circular ui icon button
                  waves-effect waves-button`}>
        <i className="add user large icon"></i>
      </div>
    );

    var Popup = (
      <div
        ref="popup"
        className="ui flowing popup form-popup">

        <div className="ui attached message">
          <div className="header">
            <T>New participant</T>
          </div>
        </div>

        <Form
          ref="form"
          className="form-popup--form attached fluid segment"
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
              placeholder={_i18n.__('Fullname')}
            />
            <Input
              name="email"
              placeholder={_i18n.__('hints.EmailOptional')}
              type="email">
              <CheckboxInput
                name="sendEmail"
                className="invitation-email-checkbox"
                label={_i18n.__('Send invitation email')}
                checked
              />
            </Input>
            <SelectInput
              placeholder={_i18n.__('Gender')}
              name="gender"
              ref="genderDropdown"
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
              disabled={!this.schema.isValid()}
              onClick={(e) => this.refs.form.submitForm(e)}>
              <i className="checkmark icon"></i>
              <T>Add participant</T>
            </button>
          </div>
        </div>

      </div>
    );

    return (
      <div>
        {AddParticipantButton}
        {Popup}
      </div>
    );

  }
});