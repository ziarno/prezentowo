import React from 'react'
import CommentsSchemas from './CommentsSchemas'
import CommentsMethods from './CommentsMethods'

/**
 * Comments Collection
 */
Comments = new Mongo.Collection('comments')
Comments
  .permit(['insert', 'update', 'remove'])
  .never()
  .apply() //ongoworks:security

Comments.Schemas = CommentsSchemas
Comments.attachSchema(Comments.Schemas.Main)

Comments.methods = CommentsMethods