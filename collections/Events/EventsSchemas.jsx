import React from 'react'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { _i18n } from 'meteor/universe:i18n'
import { participantStatuses } from '../../lib/constants'

const EventsSchemas = {}

EventsSchemas.NewParticipant = new SimpleSchema({
  participantId: {
    ...SchemaFields.Id,
    optional: true
  },
  name: SchemaFields.Name,
  email: {
    ...SchemaFields.Email,
    optional: true
  },
  pictureUrl: SchemaFields.PictureUrl,
  gender: SchemaFields.Gender
})

EventsSchemas.Participant = new SimpleSchema({
  userId: SchemaFields.Id,
  ownPresentsCount: {
    type: Number,
    defaultValue: 0
  },
  otherPresentsCount: {
    type: Number,
    defaultValue: 0
  },
  status: {
    type: String,
    allowedValues: participantStatuses
      .map(s => s.name)
  }
})

EventsSchemas.Main = new SimpleSchema({
  title: {
    type: String,
    max: 55,
    label: () => _i18n.__('Title')
  },
  type: {
    type: String,
    label: () => _i18n.__('Event Type'),
    allowedValues: ['many-to-many', 'many-to-one']
  },
  date: {
    ...SchemaFields.Date,
    min: () => new Date()
  },
  createdAt: SchemaFields.CreatedAt,
  creatorId: SchemaFields.CreatorId,
  beneficiaryIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    defaultValue: []
  },
  //only relevant in many-to-one events
  ownPresentsCount: {
    type: Number,
    defaultValue: 0
  },
  //only relevant in many-to-one events
  otherPresentsCount: {
    type: Number,
    defaultValue: 0
  },
  participants: {
    type: [EventsSchemas.Participant],
    label: () => _i18n.__('Participants'),
    defaultValue: []
  },
  participantsCount: {
    type: Number,
    defaultValue: 0
  }
})

export default EventsSchemas