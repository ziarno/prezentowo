import React from 'react'
import { Mongo } from 'meteor/mongo'
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
Comments.attachSchema(CommentsSchemas.Main)
Comments.methods = CommentsMethods
