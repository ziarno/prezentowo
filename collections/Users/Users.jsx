import React from 'react'
import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import UsersDefaults from './UsersDefaults'
import UsersSchemas from './UsersSchemas'
import UsersFunctions from './UsersFunctions'
import UsersMethods from './UsersMethods'

/**
 * Users Collection
 */
Users = Meteor.users
Users.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security

Users.defaults = UsersDefaults
Users.Schemas = UsersSchemas
Users.functions = UsersFunctions
Users.methods = UsersMethods

/**
 * Collection helpers
 */
Users.helpers({
  isEventParticipant({eventId, presentId}) {
    let present

    if (!eventId && presentId) {
      present = Presents.findOne(presentId)
      eventId = present && present.eventId
    }

    return Events.functions.participant({
      eventId,
      participantId: this._id
    }).isAccepted()
  },
  hasCreatedPresent(presentId) {
    return !!Presents.findOne({
      _id: presentId,
      creatorId: this._id
    })
  },
  isBeneficiary(event) {
    return Users.functions.isBeneficiary(event, this._id)
  }
})
