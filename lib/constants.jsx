import React from 'react'

//active means that it's visible to all users, and
//is counted in participants count
export var participantStatuses = [
  {name: 'isInvited', active: true},
  {name: 'isAccepted', active: true},
  {name: 'requestingJoin', active: false},
  {name: 'isRemoved', active: false},
  {name: 'isTemp', active: true}
]

export function isStatusActive(statusName) {
  return _.find(
    participantStatuses,
    s => s.name === statusName
  ).active
}