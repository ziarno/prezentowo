import React from 'react'
import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { _i18n } from 'meteor/universe:i18n'
import { LoggedIn } from '../../lib/Mixins'
import PresentsSchemas from './PresentsSchemas'

const PresentsMethods = {}

PresentsMethods.createPresent = new ValidatedMethod({
  name: 'Presents.methods.createPresent',
  mixins: [LoggedIn],
  validate: PresentsSchemas.NewPresent.validator(),
  run(present) {
    const isUserEventParticipant =
      Meteor.user().isEventParticipant({eventId: present.eventId})
    if (!isUserEventParticipant) {
      throw new Meteor.Error(
        `${this.name}.notParticipant`,
        _i18n.__('Not participant')
      )
    }

    const presentId = Presents.insert(present) //auto clean ok - no sub schemas
    Presents.functions.updatePresentsCount(1, presentId)
    Notifications.functions.createNotification({
      type: 'present',
      action: 'added',
      byUserId: this.userId,
      eventId: present.eventId,
      forUserId: present.forUserId,
      presentId
    })

    return presentId
  }
})

PresentsMethods.removePresent = new ValidatedMethod({
  name: 'Presents.methods.removePresent',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    }
  }).validator(),
  run({presentId}) {
    const present = Presents.findOne(presentId)

    if (!Meteor.user().hasCreatedPresent(presentId)) {
      throw new Meteor.Error(
        `${this.name}.notCreatedPresent`,
        _i18n.__('Presents deleted by creators'))
    }

    Presents.functions.updatePresentsCount(-1, presentId)

    Presents.functions.removePresents({
      _id: presentId,
      creatorId: this.userId
    })

    Notifications.functions.createNotification({
      type: 'present',
      action: 'removed',
      byUserId: this.userId,
      forUserId: present.forUserId,
      present
    })
  }
})

PresentsMethods.editPresent = new ValidatedMethod({
  name: 'Presents.methods.editPresent',
  mixins: [LoggedIn],
  validate: new SimpleSchema([
    {_id: SchemaFields.Id},
    PresentsSchemas.NewPresent.pick([
      'title',
      'description',
      'forUserId',
      'picture',
      'picture.small',
      'picture.large'
    ])
  ]).validator(),
  run({_id: presentId, title, description, forUserId, picture}) {
    if (!Meteor.user().hasCreatedPresent(presentId)) {
      throw new Meteor.Error(
        `${this.name}.notCreatedPresent`,
        _i18n.__('Presents edited by creators')
      )
    }

    Presents.update(
      presentId,
      {
        $set: {title, description, forUserId, picture}
      }
    )

    Notifications.functions.createNotification({
      type: 'present',
      action: 'changed',
      byUserId: this.userId,
      forUserId: forUserId,
      presentId: presentId
    })
  }
})

PresentsMethods.setBuyer = new ValidatedMethod({
  name: 'Presents.methods.setBuyer',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    },
    action: {
      type: Boolean
    }
  }).validator(),
  run({presentId, action}) {
    const actionName = action ? '$addToSet' : '$pull'
    const present = Presents.findOne(presentId)

    if (!Meteor.user().isEventParticipant({presentId})) {
      throw new Meteor.Error(`${this.name}.notParticipant`,
        _i18n.__('Not participant'))
    }

    Presents.update(presentId, {
      [actionName]: {
        buyers: this.userId
      }
    })

    Notifications.functions.createNotification({
      type: 'present.buyer',
      action: action ? 'added' : 'removed',
      byUserId: this.userId,
      forUserId: present.forUserId,
      present: present
    })

  }
})

export default PresentsMethods
