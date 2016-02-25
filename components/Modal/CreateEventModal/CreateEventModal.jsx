CreateEventModal = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    this.schema = this.schema || Events.Schemas.Main
      .pick(['title', 'type', 'date'])
      .namedContext('newEventForm');

    return {
      errors: {
        type: this.schema.keyErrorMessage('type'),
        date: this.schema.keyErrorMessage('date')
      }
    };
  },

  getInitialState() {
    return {
      type: null,
      date: null,
      title: null
    };
  },

  setType(type) {
    this.setState({type});
    this.schema.validateOne({type}, 'type');
  },

  setDate(date) {
    this.setState({date});
    this.schema.validateOne({date}, 'date');
  },

  submit(event) {
    event.preventDefault();
    console.log(this.state);
    if (this.schema.validate(this.state)) {
      Events.methods.createEvent.call(this.state);
      ModalManager.close();
    }
  },

  render() {
    return (
      <Modal ribbon title={_i18n.__('New event')}>
        <form
          id="new-event-form"
          className={classNames('content ui form', {
            error: !this.schema.isValid()
          })}
          onSubmit={this.submit}>

          <h3>
            <T>Title</T>
          </h3>
          <Input
            name="title"
            className="new-event-title"
            schema={this.schema}
            onChange={this.setState.bind(this)}
          />

          <h3>
            <T>Type</T>
          </h3>
          {this.data.errors.type ? (
            <div className="ui pointing red basic label">
              {this.data.errors.type}
            </div>
          ) : null}

          <div className="event-type">
            <div>
              <div
                id="many-to-many"
                ref="many-to-many"
                className={classNames('ui button no-waves', {
                  active: this.state.type === 'many-to-many'
                })}
                onClick={() => this.setType('many-to-many')}>
                <div>
                  <i className="huge users icon"></i>
                  <i className="huge exchange fitted icon"></i>
                  <i className="huge users icon"></i>
                </div>
                <p>
                  <T>Many to Many</T>
                </p>
              </div>
              <p className="hint">
                <T>hints.Christmas</T>
              </p>
            </div>

            <div>
              <div
                id="many-to-one"
                ref="many-to-one"
                className={classNames('ui button no-waves', {
                  active: this.state.type === 'many-to-one'
                })}
                onClick={() => this.setType('many-to-one')}>
                <div>
                  <i className="huge users icon"></i>
                  <i className="huge long arrow right icon"></i>
                  <i className="huge user fitted icon"></i>
                </div>
                <p>
                  <T>Many to One</T>
                </p>
              </div>
              <p className="hint">
                <T>hints.Birthday</T>
              </p>
            </div>

          </div>

          <h3 className="date-title">
            <T>Date</T>
          </h3>
          {this.data.errors.date ? (
            <div className="ui pointing red basic label">
              {this.data.errors.date}
            </div>
          ) : null}

          <Datepicker onChange={this.setDate} />

        </form>

        <div className="actions">
          <div className="ui buttons">
            <button
              className="ui labeled icon button "
              onClick={ModalManager.close}>
              <i className="remove icon"></i>
              <T>Cancel</T>
            </button>
            <button
              className="ui right labeled icon primary button"
              onClick={this.submit}>
              <i className="wizard icon"></i>
              <T>Create</T>
            </button>
          </div>
        </div>

      </Modal>
    );
  }
});