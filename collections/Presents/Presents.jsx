import React from 'react'
import { Mongo } from 'meteor/mongo'
import _ from 'underscore'
import { Meteor } from 'meteor/meteor'
import PresentsSchemas from './PresentsSchemas'
import PresentsFunctions from './PresentsFunctions'
import PresentsMethods from './PresentsMethods'

/**
 * Presents Collection
 */
Presents = new Mongo.Collection('presents')
Presents
  .permit(['insert', 'update', 'remove'])
  .never()
  .apply() //ongoworks:security


Presents.Schemas = PresentsSchemas
Presents.attachSchema(PresentsSchemas.Main)
Presents.functions = PresentsFunctions
Presents.methods = PresentsMethods

/**
 * Collection helpers
 */
Presents.helpers({
  isOwnPresent(event) {
    return Presents.functions.isOwn({present: this, event})
  },
  isUserCreator() {
    return this.creatorId === Meteor.userId()
  },
  isUserBuyer() {
    return _.contains(this.buyers, Meteor.userId())
  }
})
