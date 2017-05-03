import React from 'react'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { _i18n } from 'meteor/universe:i18n'

const CommentsSchemas = {}

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
