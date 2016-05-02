import React from 'react'
import {LoggedIn} from '../lib/Mixins'

/**
 * Presents Collection
 */
Presents = new Mongo.Collection('presents')
Presents.permit(['insert', 'update', 'remove']).never().apply() //ongoworks:security


/**
 * SCHEMAS
 */
Presents.Schemas = {}

Presents.Schemas.NewPresent = new SimpleSchema({
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

Presents.Schemas.Main = new SimpleSchema([
  Presents.Schemas.NewPresent,
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

Presents.attachSchema(Presents.Schemas.Main)

/**
 * HELPER FUNCTIONS
 */
Presents.functions = {}

Presents.functions.updatePresentsCount = function (incrementValue, presentId) {
  var present = Presents.findOne(presentId)
  var countFieldName = present.isOwn ? 'ownPresentsCount' : 'otherPresentsCount'

  if (present.forUserId) {
    Events.update({
      _id: present.eventId,
      'participants.userId': present.forUserId
    }, {$inc: {
      [countFieldName]: incrementValue,
      [`participants.$.${countFieldName}`]: incrementValue
    }})
  } else {
    Events.update({
      _id: present.eventId
    }, {$inc: {
      [countFieldName]: incrementValue
    }})
  }

}

Presents.functions.isOwn = function ({
  present,
  event,
  forUserId = present && present.forUserId,
  creatorId = present && present.creatorId
  }) {
    var isManyToOneEvent = event && event.type === 'many-to-one'
    if (isManyToOneEvent) {
      //present isOwn if its creator is one of the beneficiaries
      return Users.functions.isBeneficiary(event, creatorId)
    }

    return forUserId === creatorId
}

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

/**
 * METHODS
 */
Presents.methods = {}

Presents.methods.createPresent = new ValidatedMethod({
  name: 'Presents.methods.createPresent',
  mixins: [LoggedIn],
  validate: Presents.Schemas.NewPresent.validator(),
  run(present) {
    if (!Meteor.user().isEventParticipant({eventId: present.eventId})) {
      throw new Meteor.Error(
        `${this.name}.notParticipant`,
        _i18n.__('Not participant'))
    }

    var presentId = Presents.insert(present) //auto clean ok - no sub schemas
    Presents.functions.updatePresentsCount(1, presentId)
    return presentId
  }
})

Presents.methods.removePresent = new ValidatedMethod({
  name: 'Presents.methods.removePresent',
  mixins: [LoggedIn],
  validate: new SimpleSchema({
    presentId: {
      type: String
    }
  }).validator(),
  run({presentId}) {
    var present = Presents.findOne(presentId)
    var commentsToRemove = [
      ...present.commentsShared,
      ...present.commentsSecret
    ]

    if (!Meteor.user().hasCreatedPresent(presentId)) {
      throw new Meteor.Error(
        `${this.name}.notCreatedPresent`,
        _i18n.__('Presents deleted by creators'))
    }

    Presents.functions.updatePresentsCount(-1, presentId)

    if (commentsToRemove.length) {
      Comments.remove({
        _id: {
          $in: commentsToRemove
        }
      })
    }

    return Presents.remove({
      _id: presentId,
      creatorId: this.userId
    })
  }
})

Presents.methods.editPresent = new ValidatedMethod({
  name: 'Presents.methods.editPresent',
  mixins: [LoggedIn],
  validate: new SimpleSchema([
    {
      _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    },
    Presents.Schemas.NewPresent.pick([
      'title',
      'description',
      'forUserId',
      'picture',
      'picture.small',
      'picture.large'
    ])
  ]).validator(),
  run(present) {
    if (!Meteor.user().hasCreatedPresent(present._id)) {
      throw new Meteor.Error(
        `${this.name}.notCreatedPresent`,
        _i18n.__('Presents edited by creators'))
    }

    return Presents.update(present._id, {$set: present})
  }
})

Presents.methods.setBuyer = new ValidatedMethod({
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
    var actionName = action ? '$addToSet' : '$pull'

    if (!Meteor.user().isEventParticipant({presentId})) {
      throw new Meteor.Error(`${this.name}.notParticipant`, _i18n.__('Not participant'))
    }
    return Presents.update(presentId, {
      [actionName]: {
        buyers: this.userId
      }
    })
  }
})