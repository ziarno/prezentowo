/**
 * Comments Collection
 */
Invitations = new Mongo.Collection('invitations');
Invitations.permit(['insert', 'update', 'remove']).never().apply(); //ongoworks:security

/**
 * SCHEMAS
 */
Invitations.Schemas = {};

Invitations.Schemas.Main = new SimpleSchema({
  forEventId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  forUserId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  isForTempUser: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    label: () => _i18n.__('Created'),
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  }
});

Invitations.attachSchema(Invitations.Schemas.Main);

/**
 * HELPER FUNCTIONS
 */
Invitations.functions = {};

Invitations.functions.resolve = function (status, invitationId) {
  var invitation = Invitations.findOne(invitationId);

  if (invitation) {
    Events.functions.setInvitationStatus({
      eventId: invitation.forEventId,
      participantId: invitation.forUserId,
      status
    });
  }

  return Invitations.remove(invitation);
};

Invitations.functions.accept = Invitations.functions.resolve.bind(null, 'accepted');
Invitations.functions.reject = Invitations.functions.resolve.bind(null, 'rejected');
