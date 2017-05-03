import React from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

const JoinEvent = ({ eventId }) => (
  <button
    onClick={() => {
      Events.methods.requestJoin.call({ eventId })
    }}
    className="ui left labeled icon button waves-effect waves-button"
  >
    <i className="add user icon" />
    <T>Join event</T>
  </button>
)

export default JoinEvent
