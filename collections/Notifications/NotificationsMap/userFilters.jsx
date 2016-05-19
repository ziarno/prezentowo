import React from 'react'

export function getByUser({byUser}) {
  return [byUser._id]
}
export function getEventParticipants({event}) {
  var acceptedParticipants =
    Events.functions.getAcceptedParticipants({event})
  return _.map(acceptedParticipants, p => p.userId)
}
export function getEventBeneficiaries({event}) {
  return event.beneficiaryIds
}
export function getForUser({forUser}) {
  return forUser && [forUser._id]
}
export function getEventCreator({event}) {
  return [event.creatorId]
}
