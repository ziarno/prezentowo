import React from 'react'

var PresentsSchemas = {}

PresentsSchemas.NewPresent = new SimpleSchema({
  title: {
    type: String,
    max: 70,
    label: () => _i18n.__('Title')
  },
  picture: {
    type: Object,
    label: () => _i18n.__('Picture')
  },
  'picture.small': SchemaFields.PictureUrl,
  'picture.large': SchemaFields.PictureUrl,
  description: {
    type: String,
    label: () => _i18n.__('Description'),
    optional: true
  },
  eventId: SchemaFields.Id,
  forUserId: {
    ...SchemaFields.Id,
    optional: true, //not needed for events many-to-one
    label: () => _i18n.__('User')
  }
})

PresentsSchemas.Main = new SimpleSchema([
  PresentsSchemas.NewPresent,
  {
    buyers: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      defaultValue: [],
      label: () => _i18n.__('Buyers')
    },
    commentsSecret: {
      type: [String],
      defaultValue: [],
      label: () => _i18n.__('Secret comments')
    },
    commentsShared: {
      type: [String],
      defaultValue: [],
      label: () => _i18n.__('Shared comments')
    },
    creatorId: SchemaFields.CreatorId,
    createdAt: SchemaFields.CreatedAt,
    isOwn: {
      type: Boolean,
      autoValue() {
        if (!this.isInsert) {
          return
        }

        var eventId = this.field('eventId').value
        var event = Events.findOne(eventId)

        return Presents.functions.isOwn({
          event,
          forUserId: this.field('forUserId').value,
          creatorId: this.field('creatorId').value
        })
      }
    }
  }
])

export default PresentsSchemas