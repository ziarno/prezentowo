import React from 'react'

//user filters
export function getByUser({byUser}) {
  return [byUser._id]
}
export function getEventParticipants({event}) {
  const acceptedParticipants =
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

export function showPresent({forPresent}) {
  ModalManager.open(
    <PresentDetails presentId={forPresent.id} />,
    {
      id: 'present-details',
      className: 'inverted'
    }
  )
}
export function showEvent({forEvent}) {
  FlowRouter.go(`/event/id/${forEvent.id}`)
}
export function showEventByUser({forEvent, byUser}) {
  FlowRouter.go(`/event/id/${forEvent.id}/user/${byUser.id}`)
}
export function showEventForUser({forEvent, forUser}) {
  FlowRouter.go(`/event/id/${forEvent.id}/user/${forUser.id}`)
}
