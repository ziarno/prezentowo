AddParticipant = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },

  getMeteorData() {
    this.schema = this.schema || Events.Schemas.NewParticipant
        .namedContext('newParticipant');

    return {
      errors: {
        name: this.schema.keyErrorMessage('name'),
        email: this.schema.keyErrorMessage('email'),
        gender: this.schema.keyErrorMessage('gender')
      }
    };
  },

  getInitialState() {
    return {
      name: null,
      email: null,
      gender: null,
      pictureUrl: '/images/avatars/m1.png',
      sendEmail: true
    };
  },

  componentDidMount() {
    $(this.refs.addParticipantButton).popup({
      popup: '.add-participant.popup',
      on: 'click',
      position: 'bottom left',
      lastResort: 'bottom left',
      preserve: true,
      transition: 'slide down',
      onHide: () => {
        this.schema.resetValidation();
      }
    });
  },

  hide(callback) {
    $(this.refs.addParticipantButton).popup('hide', callback);
  },

  reset() {
    $(this.refs.addParticipantForm).form('clear');
    this.refs.emailCheckbox.reset();
    this.refs.imagePicker.reset();
    this.refs.genderDropdown.reset();
    this.schema.resetValidation();
    this.setState(this.getInitialState());
  },

  hideAndReset() {
    this.hide(this.reset);
  },

  setPictureUrl(pictureObject) {
    this.setState(pictureObject);
    this.schema.validateOne(pictureObject, 'pictureUrl');
  },

  setGender({gender}) {
    this.setState({gender});
    this.setPictureUrl({pictureUrl: this.refs.imagePicker.getImage()});
  },

  submit(event) {
    event.preventDefault();
    if (this.schema.validate({
          name: this.state.name,
          email: this.state.email,
          gender: this.state.gender,
          pictureUrl: this.state.pictureUrl
        })
    ) {
      this.props.onSubmit(this.state);
      this.hideAndReset();
    }
  },

  render() {
    var avatarsCount = 12;
    var avatars = _.range(avatarsCount).map((index) => (
      `/images/avatars/${this.state.gender ? this.state.gender.charAt(0) : 'm'}${index + 1}.png`
    ));

    var addParticipantPopup = (
      <FormPopup
        className="add-participant">
        <div className="add-participant--content ui attached message">
          <div className="header">
            <T>New participant</T>
          </div>
        </div>
        <form
          ref="addParticipantForm"
          className="add-participant--form ui form attached fluid segment"
          onSubmit={this.submit}>
          <ImagePicker
            ref="imagePicker"
            onChange={this.setPictureUrl}
            images={avatars}
          />
          <div className="add-participant--form-right" >
            <Input
              placeholder={_i18n.__('Fullname')}
              name="name"
              schema={this.schema}
              onChange={this.setState.bind(this)}
            />
            <Input
              placeholder={_i18n.__('hints.EmailOptional')}
              type="email"
              name="email"
              schema={this.schema}
              onChange={this.setState.bind(this)}>
              <CheckboxInput
                name="sendEmail"
                ref="emailCheckbox"
                className="invitation-email-checkbox"
                label={_i18n.__('Send invitation email')}
                onChange={this.setState.bind(this)}
                checked
              />
            </Input>
            <SelectInput
              placeholder={_i18n.__('Gender')}
              name="gender"
              ref="genderDropdown"
              schema={this.schema}
              onChange={this.setGender}>
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
        </form>
        {!this.schema.isValid() ? (
          <Message
            className="attached fluid error"
            messages={this.schema.invalidKeys().map((key) => (
                this.schema.keyErrorMessage(key.name)
              ))}>
          </Message>
        ) : null}
        <div className="ui bottom attached message actions">
          <div className="ui buttons">
            <button
              className="ui button"
              onClick={this.hideAndReset}>
              <T>Cancel</T>
            </button>
            <button
              className="ui right labeled icon primary button"
              disabled={!this.schema.isValid()}
              onClick={this.submit}>
              <i className="plus icon"></i>
              <T>Add participant</T>
            </button>
          </div>
        </div>
      </FormPopup>
    );

    var addParticipantButton = (
      <div
        ref="addParticipantButton"
        className={`user-list--add-participant-button
                circular ui icon button
                waves-effect waves-button`}>
        <i className="add user large icon"></i>
      </div>
    );

    return (
      <div>
        {addParticipantButton}
        {addParticipantPopup}
      </div>
    );
  }
});