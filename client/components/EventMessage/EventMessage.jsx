import React from 'react'

EventMessage = class EventMessage extends React.Component {

  render() {
    var {event} = this.props
    var creator = event && Participants.findOne(event.creatorId)
    var participant = _.find(event.participants,
      p => p.userId === Meteor.userId())
    var status = participant && participant.status

    return (
      <div className="event-message">
        <p>
          <T>Welcome to event</T>
        </p>
        <p className="event-message--styled-title">
          {event && event.title}
        </p>
        <div className="event-message--created-by">
          <T>created by</T>
          <span>:&nbsp;</span>
          <User user={creator}></User>
        </div>
        <div className="ui message">
          {status === 'requestingJoin' ? (
            <div>
              <p><T>hints.joinRequestSent</T></p>
              <p><T>hints.awaitCreatorConfirmation</T></p>
            </div>
          ) : status === 'isInvited' ? (
            <div>
              <div className="text-with-user translations">
                <User user={creator} />
                <T>{`${creator.profile.gender}.invited`}</T>
                <T>you to join this event</T>
              </div>
              <div className="ui buttons">
                <button
                  onClick={() => {
                    Events.methods.answerInvitation.call({
                      eventId: event._id,
                      acceptInvitation: false
                    })
                  }}
                  className="ui red left labeled icon button">
                  <i className="remove icon" />
                  <T>Decline</T>
                </button>
                <button
                  onClick={() => {
                    Events.methods.answerInvitation.call({
                      eventId: event._id,
                      acceptInvitation: true
                    })
                  }}
                  className="ui primary left labeled icon button">
                  <i className="checkmark icon" />
                  <T>Accept</T>
                </button>
              </div>
            </div>
          ) : Meteor.user() ? (
            <button
              onClick={() => {
                Events.methods.requestJoin.call({
                  eventId: event._id
                })
              }}
              className={classNames(
                'ui left labeled icon button',
                'waves-effect waves-button')}>
              <i className="add user icon" />
              <T>Join event</T>
            </button>
          ) : (
            <p className="translations">
              <a href="/sign-in">
                <T>Login</T>
              </a>
              <T>or</T>
              <a href="/sign-up">
                <T>Register</T>
              </a>
              <T>to join this event</T>
            </p>
          )}
        </div>
      </div>
    )
  }

}

EventMessage.propTypes = {
  event: React.PropTypes.object
}