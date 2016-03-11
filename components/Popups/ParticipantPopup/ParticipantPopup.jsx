import {Popup} from '../../../lib/Mixins';

ParticipantPopup = React.createClass({

  mixins: [ReactMeteorData, Popup],

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },

  getMeteorData() {
    this.schema = this.schema || Events.Schemas.NewParticipant
        .namedContext('newParticipant');

    return {
      errors: this.schema.invalidKeys()
    };
  },

  getPopupSettings() {
    return {
      onHide: () => this.schema.resetValidation()
    };
  },

  getInitialState() {
    return {
      images: []
    };
  },

  reset() {
    this.refs.addParticipantForm.reset();
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

  submit(formData) {
    if (this.schema.validate(_.omit(formData, 'sendEmail'))) {
      this.props.onSubmit(formData);
      this.hideAndReset();
    }
  },

  componentDidMount() {
    this.updateImages({gender: 'male'});
  },

  render() {

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
          ref="addParticipantForm"
          className="form-popup--form attached fluid segment"
          onSubmit={this.submit}
          schema={this.schema}>
          <ImagePicker
            name="pictureUrl"
            images={this.state.images}
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
        {!this.schema.isValid() ? (
          <Message
            className="form-popup--error icon attached fluid error"
            icon="warning"
            messages={this.schema.invalidKeys().map((key) => (
                this.schema.keyErrorMessage(key.name)
            ))}
          />
        ) : null}
        <div className="ui bottom attached message actions">
          <div className="ui buttons">
            <button
              className="ui labeled icon button"
              onClick={this.hideAndReset}>
              <i className="remove icon"></i>
              <T>Cancel</T>
            </button>
            <button
              className="ui labeled icon primary button"
              disabled={!this.schema.isValid()}
              onClick={(e) => this.refs.addParticipantForm.submit(e)}>
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