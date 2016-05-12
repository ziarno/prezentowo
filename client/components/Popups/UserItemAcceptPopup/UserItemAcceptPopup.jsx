import React from 'react'
import {PopupComponent} from '../../../../lib/Mixins'
import {createContainer} from 'meteor/react-meteor-data'

UserItemAcceptPopup = class UserItemAcceptPopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.getPopupSettings = this.getPopupSettings.bind(this)
    this.answerJoinRequest = this.answerJoinRequest.bind(this)
    this.acceptJoinRequest = this.acceptJoinRequest.bind(this)
    this.denyJoinRequest = this.denyJoinRequest.bind(this)
  }

  getPopupSettings() {
    var position = 'right center'
    return {
      position,
      lastResort: position
    }
  }

  renderTrigger() {
    var {user} = this.props
    return (
      <div
        ref="popupTrigger">
        <UserItem
          className="ui yellow message"
          user={user}
          onClick={this.showPopup}>
          <i className="add user large icon" />
        </UserItem>
      </div>
    )
  }

  answerJoinRequest(accept) {
    var event = Session.get('event')
    var {user} = this.props

    Events.methods.answerJoinRequest.call({
      eventId: event._id,
      participantId: user._id,
      acceptRequest: accept
    })
  }

  acceptJoinRequest() {
    this.answerJoinRequest(true)
  }

  denyJoinRequest() {
    this.answerJoinRequest(false)
  }

  renderPopup() {
    var {user} = this.props

    return (
      <div
        ref="popupTarget"
        className="user-item-accept-popup ui flowing popup">

        <div className="title text-with-user translations">
          <User user={user} />
          <T>is requesting to join this event</T>
        </div>

        <FormActionButtons
          showRemove
          acceptButtonText="Add new participant"
          removeIcon="remove user"
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
  user: React.PropTypes.object.isRequired
}
