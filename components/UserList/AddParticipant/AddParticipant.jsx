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
    $(this.refs.genderDropdown).dropdown({
      onChange: (value) => {
        this.setState({gender: value});
        this.schema.validateOne({gender: value}, 'gender');
      }
    });
    $(this.refs.emailCheckbox).checkbox({
      onChecked: () => {
        this.setState({
          sendEmail: true
        });
      },
      onUnchecked: () => {
        this.setState({
          sendEmail: false
        });
      }
    });
  },

  hide(callback) {
    $(this.refs.addParticipantButton).popup('hide', callback);
  },

  reset() {
    $(this.refs.addParticipantForm).form('clear');
    this.setState(this.getInitialState());
    $(this.refs.emailCheckbox).checkbox('check');
    this.refs.imagePicker.reset();
    this.schema.resetValidation();
  },

  hideAndReset() {
    this.hide(this.reset);
  },

  setPictureUrl(pictureObject) {
    this.setState(pictureObject);
    this.schema.validateOne(pictureObject, 'pictureUrl');
  },

  submit(event) {
    event.preventDefault();
    if (this.schema.validate(_.omit(this.state, 'sendEmail'))) {
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
              className="ui field"
              placeholder={_i18n.__('Fullname')}
              name="name"
              schema={this.schema}
              onChange={this.setState.bind(this)}
            />
            <Input
              className="ui field"
              placeholder={_i18n.__('hints.EmailOptional')}
              type="email"
              name="email"
              schema={this.schema}
              onChange={this.setState.bind(this)}>
              <div
                ref="emailCheckbox"
                className={classNames('invitation-email-checkbox ui checkbox', {
                  checked: this.state.sendEmail
                })}>
                <input
                  type="checkbox"
                  tabIndex="0"
                  defaultChecked
                  className="hidden"
                />
                <label>
                  <T>Send invitation email</T>
                </label>
              </div>
            </Input>
            <div
              ref="genderDropdown"
              className={classNames('ui fluid selection dropdown', {
                error: this.schema.keyIsInvalid('gender')
              })}>
              <input
                type="hidden"
                name="sendEmail" />
              <div className="default text">
                <T>Gender</T>
              </div>
              <i className="dropdown icon"></i>
              <div className="menu">
                <div className="item" data-value="male">
                  <i className="man icon"></i>
                  <T>Male</T>
                </div>
                <div className="item" data-value="female">
                  <i className="woman icon"></i>
                  <T>Female</T>
                </div>
              </div>
            </div>
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

    return (
      <div>
        <div
          ref="addParticipantButton"
          className={`user-list--add-participant-button
                circular ui icon button
                waves-effect waves-button`}>
          <i className="add user large icon"></i>
        </div>

        {addParticipantPopup}

      </div>
    );
  }
});