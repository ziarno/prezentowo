import React from 'react'
import {
  getByUser,
  getEventParticipants,
  getEventBeneficiaries,
  getForUser
} from './userFilters'

var present = {}

present.added = {
  usersFilter: function (notificationData) {
    var {event, present} = notificationData
    var isManyToOne = event.type === 'many-to-one'
    var {isOwn} = present

    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      isManyToOne && !isOwn &&
        getEventBeneficiaries(notificationData),
      !isOwn &&
        getForUser(notificationData)
    )
  },
  icon: ['present', 'add'],
  hasPicture: true,
  getPicture(notification) {
    var {forPresent} = notification
    return forPresent && forPresent.picture
  },
  getMessageEl(notification) {
    var {byUser, forUser, forPresent} = notification
    var isOwn = byUser && forUser && byUser.id === forUser.id
    return (
      <div className="translations text-with-user">
        <User {...byUser} />
        <T>{`${byUser.gender}.hasAdded`}</T>
        <T>a new present</T>
        {!isOwn && forUser? (
        <T>for</T>
          ) : null}
        {!isOwn && forUser ? (
        <User {...forUser} />
          ) : null}
        :
        <span>{forPresent.title}</span>
      </div>
    )
  }
}

present.changed = {
  usersFilter: present.added.usersFilter,
  icon: ['present', 'edit'],
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl(notification) {
    var {byUser, forPresent} = notification
    return (
      <div className="translations text-with-user">
        <User {...byUser} />
        <T>{`${byUser.gender}.hasEdited`}</T>
        <T>present</T>
        <span>{forPresent.title}</span>
      </div>
    )
  }
}

present.removed = {
  usersFilter: present.added.usersFilter,
  icon: ['present', 'remove'],
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl(notification) {
    var {byUser, forPresent} = notification
    return (
      <div className="translations text-with-user">
        <User {...byUser} />
        <T>{`${byUser.gender}.hasRemoved`}</T>
        <T>present</T>
        <span>{forPresent.title}</span>
      </div>
    )
  }
}

export default present