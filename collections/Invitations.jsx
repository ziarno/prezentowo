import React from 'react'

/**
 * Comments Collection
 */
Invitations = new Mongo.Collection('invitations')
Invitations.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security

/**
 * SCHEMAS
 */
Invitations.Schemas = {}

Invitations.Schemas.Main = new SimpleSchema({
  forEventId: SchemaFields.Id,
  forUserId: SchemaFields.Id,
  isForTempUser: {
    type: Boolean
  },
  createdAt: SchemaFields.CreatedAt
})

Invitations.attachSchema(Invitations.Schemas.Main)

/**
 * HELPER FUNCTIONS
 */
Invitations.functions = {}

Invitations.functions.resolve = function (status, invitationId) {
  var invitation = Invitations.findOne(invitationId)

  if (invitation) {
    Events.functions.setInvitationStatus({
      eventId: invitation.forEventId,
      participantId: invitation.forUserId,
      status
    })
  }

  return Invitations.remove(invitation)
}

Invitations.functions.accept = Invitations.functions.resolve.bind(null, 'accepted')
Invitations.functions.reject = Invitations.functions.resolve.bind(null, 'rejected')
