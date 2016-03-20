import {Popup} from '../../../../lib/Mixins';

EventPopup = React.createClass({

  propTypes: {
    event: React.PropTypes.object
  },

  mixins: [Popup],

  getPopupSettings() {
    return {
      onShow: () => {this.schema.resetValidation()},
      position: 'bottom right',
      lastResort: 'bottom right',
      transition: 'slide down'
    };
  },

  reset() {
    this.refs.form.reset();
  },

  hideAndReset() {
    this.hidePopup(this.reset);
  },

  submitEvent(data) {
    var eventId;

    if (!this.schema.validate(data)) {
      return;
    }

    if (this.isEdit()) {
      Events.methods.editEvent.call({
        eventId: FlowRouter.getParam('eventId'),
        ...data
      });
    } else {
      eventId = Events.methods.createEvent.call(data);
      FlowRouter.go(`/event/id/${eventId}`);
    }
    this.hideAndReset();
  },

  isEdit() {
    return !!this.props.event;
  },

  render() {
    this.schema = this.schema || Events.Schemas.Main
        .pick(['title', 'type', 'date'])
        .namedContext('newEventForm');

    var Popup = (
      <div
        ref="popup"
        className="ui flowing popup form-popup event-popup">

        <div className="ui attached message">
          <div className="header">
            {this.isEdit() ? (
              <T>Edit event</T>
            ) : (
              <T>New event</T>
            )}
          </div>
        </div>

        <Form
          ref="form"
          data={this.props.event}
          className="form-popup--form attached fluid segment"
          onSubmit={this.submitEvent}
          schema={this.schema}>
          <Input
            name="title"
            label="Title"
          />
          <div className="form-popup--form flex">
            <div className="ui field">
              <Datepicker
                name="date"
                label="Date"
              />
            </div>
            <div className="form-popup--form-right">
              <EventTypeInput
                name="type"
              />
            </div>
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
              className="ui labeled icon primary button"
              onClick={(e) => this.refs.form.submitForm(e)}>
              <i className="checkmark icon"></i>
              {this.isEdit() ? (
                <T>Save</T>
              ) : (
                <T>Create event</T>
              )}
            </button>
          </div>
        </div>

      </div>
    );

    return (
      <div
        className="ui icon button waves-effect waves-button"
        ref="popupTrigger">
        <i className={classNames({
          setting: this.isEdit(),
          plus: !this.isEdit()
        }, 'icon')} />
        {Popup}
      </div>
    );

  }
});