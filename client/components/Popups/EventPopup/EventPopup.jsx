import {Popup} from '../../../../lib/Mixins'
import reactMixin from 'react-mixin'

EventPopup = class EventPopup extends React.Component {

  constructor() {
    super()
    this.state = {
      showDeleteConfirmation: false
    }
    this.schema = Events.Schemas.Main
        .pick(['title', 'type', 'date'])
        .namedContext('newEventForm')
    this.reset = this.reset.bind(this)
    this.hideAndReset = this.hideAndReset.bind(this)
    this.submitEvent = this.submitEvent.bind(this)
    this.isEdit = this.isEdit.bind(this)
    this.removeEvent = this.removeEvent.bind(this)
    this.setState = this.setState.bind(this)
  }

  getPopupSettings() {
    return {
      onShow: () => {
        this.schema.resetValidation()
        this.setState({showDeleteConfirmation: false})
      },
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

  submitEvent(data) {
    var eventId

    if (!this.schema.validate(data)) {
      return
    }

    if (this.isEdit()) {
      Events.methods.editEvent.call({
        eventId: FlowRouter.getParam('eventId'),
        ...data
      })
    } else {
      eventId = Events.methods.createEvent.call(data)
      FlowRouter.go(`/event/id/${eventId}`)
    }
    this.hideAndReset()
  }

  removeEvent() {
    Events.methods.removeEvent.call({
      eventId: FlowRouter.getParam('eventId')
    })
    this.hidePopup(() => {
      this.reset()
      FlowRouter.go('/')
    })
  }

  isEdit() {
    return !!this.props.event
  }

  render() {

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
                onClick={this.removeEvent}>
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
        )}

      </div>
    )

    return (
      <div className={this.props.wrapperClassName}>
        <div
          ref="popupTrigger"
          className={classNames('ui compact icon button waves-effect', this.props.buttonClassName)}>
          <i className={classNames({
            setting: this.isEdit(),
            plus: !this.isEdit()
          }, 'icon')} />
        </div>
        {Popup}
      </div>
    )
  }

}

EventPopup.propTypes = {
  event: React.PropTypes.object,
  wrapperClassName: React.PropTypes.string,
  wrapperbuttonClassName: React.PropTypes.string
}

reactMixin(EventPopup.prototype, Popup)