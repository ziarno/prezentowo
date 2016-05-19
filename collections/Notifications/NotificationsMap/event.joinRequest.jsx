import React from 'react'
import {
  getForUser,
  getEventCreator
} from './userFilters'

var eventJoinRequest = {}

eventJoinRequest.accepted = {
  usersFilter: getForUser
}

eventJoinRequest.rejected = {
  usersFilter: getForUser
}

eventJoinRequest.added = {
  usersFilter: getEventCreator
}

export default eventJoinRequest