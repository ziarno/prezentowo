import React from 'react'

const IsInvited = ({ eventId,  creator }) => {

  function answerInvitation(isAccepted) {
    Events.methods.answerInvitation.call({
      eventId,
      acceptInvitation: isAccepted
    })
  }

  return (
    <div>
      <div className="text-with-user translations">
        <User user={creator} />
        <T>{`${creator.profile.gender}.invited`}</T>
        <T>you to join this event</T>
      </div>
      <div className="ui buttons">
        <button
          onClick={() => answerInvitation(false)}
          className="ui red left labeled icon button"
        >
          <i className="remove icon" />
          <T>Decline</T>
        </button>
        <button
          onClick={() => answerInvitation(true)}
          className="ui primary left labeled icon button"
        >
          <i className="checkmark icon" />
          <T>Accept</T>
        </button>
      </div>
    </div>
  )
}

export default IsInvited
