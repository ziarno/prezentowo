import React from 'react'

var CommentsSchemas = {}

CommentsSchemas.Main = new SimpleSchema({
  creatorId: SchemaFields.CreatorId,
  createdAt: SchemaFields.CreatedAt,
  presentId: SchemaFields.Id,
  message: {
    type: String,
    label: () => _i18n.__('Message')
  }
})

export default CommentsSchemas