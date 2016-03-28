import React from 'react'
import {PopupComponent} from '../../../../lib/Mixins'

EventPopup = class EventPopup extends PopupComponent {

  constructor() {
    super()
    this.state = _.extend(this.state, {
      showDeleteConfirmation: false
    })
    this.schema = Events.Schemas.Main
        .pick(['title', 'type', 'date'])
        .namedContext('newEventForm')
    this.reset = this.reset.bind(this)
    this.hideAndReset = this.hideAndReset.bind(this)
    this.submitEvent = this.submitEvent.bind(this)
    this.isEdit = this.isEdit.bind(this)
    this.removeEvent = this.removeEvent.bind(this)
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

  submitEvent(data) {
    var eventId

    if (!this.schema.validate(data)) {
      return
    }

    if (this.isEdit()) {
      Events.methods.editEvent.call({
        eventId: Session.get('event')._id,
        ...data
      })
    } else {
      eventId = Events.methods.createEvent.call(data)
      FlowRouter.go(`/event/id/${eventId}`)
    }
    this.hideAndReset()
  }

  removeEvent() {
    this.hidePopup(() => {
      this.reset()
      Events.methods.removeEvent.call({
        eventId: Session.get('event')._id
      })
      FlowRouter.go('/')
    })
  }

  isEdit() {
    return !!this.props.event
  }

  renderTrigger() {
    return (
      <div
        onClick={this.showPopup}
        ref="popupTrigger"
        className={classNames(
          'ui compact icon button waves-effect',
          this.props.buttonClassName)}>
        {this.props.icon}
      </div>
    )
  }

  renderPopup() {
    return (
      <div
        ref="popupTarget"
        className="ui flowing popup form-popup event-popup">
        <Form
          ref="form"
          data={this.props.event}
          onSubmit={this.submitEvent}
          schema={this.schema}>

          <div className="ui attached message">
            <div className="header">
              {this.isEdit() ? (
                <T>Edit event</T>
              ) : (
                <T>New event</T>
              )}
            </div>
          </div>

          <div
            className="form-popup--form ui form attached fluid segment">
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
          </div>

          <FormErrorMessage />

          <FormActionButtons
            showRemove={this.isEdit()}
            acceptButtonText={this.isEdit() ? 'Save' : 'Create event'}
            onRemove={this.removeEvent}
            onCancel={this.hideAndReset}
            onAccept={(e) => this.refs.form.submitForm(e)}
          />

        </Form>
      </div>
    )
  }

}

EventPopup.propTypes = {
  event: React.PropTypes.object,
  buttonClassName: React.PropTypes.string,
  icon: React.PropTypes.element
}