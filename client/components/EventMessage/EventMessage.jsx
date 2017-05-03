import React, { Component, PropTypes } from 'react'
import _ from 'underscore'
import { Meteor } from 'meteor/meteor'
import {
  IsInvited,
  RequestingJoin,
  JoinEvent,
  LoginOrRegister
} from './subviews'

EventMessage = class EventMessage extends Component {

  render() {
    const { event } = this.props
    const creator = event && Participants.findOne(event.creatorId)
    const participant = _.find(
      event.participants,
      p => p.userId === Meteor.userId()
    )
    const status = participant && participant.status
    let message

    if (status === 'requestingJoin') {
      message = <RequestingJoin />
    } else if (status === 'isInvited') {
      message =
        <IsInvited
          creator={creator}
          eventId={event._id}
        />
    } else if (Meteor.user()) {
      message = <JoinEvent eventId={event._id} />
    } else {
      message = <LoginOrRegister />
    }

    return (
      <div className="event-message">
        <p><T>Welcome to event</T></p>
        <p className="event-message--styled-title">
          {event && event.title}
        </p>
        <div className="event-message--created-by">
          <T>created by</T>
          <span>:&nbsp;</span>
          <User user={creator} />
        </div>
        <div className="ui message">
          {message}
        </div>
      </div>
    )
  }
}

EventMessage.propTypes = {
  event: PropTypes.object
}
