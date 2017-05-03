import React, { PropTypes } from 'react'
import { Session } from 'meteor/session'
import { createContainer } from 'meteor/react-meteor-data'
import { PopupComponent } from '../../../../lib/Mixins'

UserItemAcceptPopup = class UserItemAcceptPopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.getPopupSettings = this.getPopupSettings.bind(this)
    this.answerJoinRequest = this.answerJoinRequest.bind(this)
    this.acceptJoinRequest = this.acceptJoinRequest.bind(this)
    this.denyJoinRequest = this.denyJoinRequest.bind(this)
    this.replaceUser = this.replaceUser.bind(this)
  }

  getPopupSettings() {
    const position = 'right center'
    return {
      position,
      lastResort: position
    }
  }

  renderTrigger() {
    const { user } = this.props
    return (
      <div ref="popupTrigger">
        <UserItem
          className="ui yellow message"
          user={user}
          onClick={this.showPopup}
        >
          <i className="add user large icon" />
        </UserItem>
      </div>
    )
  }

  answerJoinRequest(accept, mergeWithUserId) {
    const event = Session.get('event')
    const { user } = this.props

    Events.methods.answerJoinRequest.call({
      eventId: event._id,
      participantId: user._id,
      acceptRequest: accept,
      mergeWithUserId
    })
  }

  acceptJoinRequest() {
    this.answerJoinRequest(true)
  }

  denyJoinRequest() {
    this.answerJoinRequest(false)
  }

  replaceUser({ mergeWithUserId }) {
    this.answerJoinRequest(true, mergeWithUserId)
  }

  renderPopup() {
    const {
      user,
      tempParticipants
    } = this.props
    const existTempParticipants = tempParticipants.length > 0

    return (
      <div
        ref="popupTarget"
        className="user-item-accept-popup ui flowing popup"
      >

        <div className="title text-with-user translations">
          <User user={user} />
          <T>is requesting to join this event</T>
        </div>

        {existTempParticipants ? (
          <Form
            onSubmit={this.replaceUser}
            className="replace-user-field text-with-user"
          >
            <span className="translations">
              <T>Add</T>
              <T>and</T>
              <T>replace</T>
            </span>
            <SelectInput
              inline
              className="scrolling"
              selectDefault={tempParticipants[0]._id}
              name="mergeWithUserId"
            >
              {tempParticipants.map(user => (
                <div
                  className="item"
                  key={user._id}
                  data-value={user._id}
                >
                  <User user={user} />
                </div>
              ))}
            </SelectInput>
            <button
              type="submit"
              className="replace-button ui primary icon left labeled button"
            >
              <i className="exchange icon" />
              <T>replace</T>
            </button>
          </Form>
        ) : null}

        <FormActionButtons
          showRemove
          acceptButtonText="Add"
          removeIcon="remove user"
          acceptIcon="plus"
          removeText="Decline"
          onRemove={this.denyJoinRequest}
          onAccept={this.acceptJoinRequest}
          onCancel={this.hideAndReset}
        />

      </div>
    )
  }

}

UserItemAcceptPopup.propTypes = {
  user: PropTypes.object.isRequired
}

UserItemAcceptPopup = createContainer(() => {
  return {
    tempParticipants: Participants
      .find({isTemp: true})
      .fetch()
  }
}, UserItemAcceptPopup)
