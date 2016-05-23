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
  icon: {main: 'gift', corner: 'add'},
  hasPicture: true,
  getPicture(notification) {
    var {forPresent} = notification
    return forPresent && forPresent.picture
  },
  getMessageEl(notification) {
    var {forUser, forPresent} = notification
    return (
      <div className="translations text-with-user">
        <User
          picture={forPresent.picture}
          name={forPresent.title}
        />
        <span>-</span>
        <T>a new present</T>
        {forUser? (
          <T>for</T>
        ) : null}
        {forUser ? (
          <User {...forUser} />
        ) : null}
      </div>
    )
  }
}

present.changed = {
  usersFilter: present.added.usersFilter,
  icon: {main: 'gift', corner: 'edit'},
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl(notification) {
    var {byUser, forPresent} = notification
    return (
      <div className="translations text-with-user">
        <User {...byUser} />
        <T>{`${byUser.gender}.hasEdited`}</T>
        <User
          picture={forPresent.picture}
          name={forPresent.title}
        />
      </div>
    )
  }
}

present.removed = {
  usersFilter: present.added.usersFilter,
  icon: {main: 'gift', corner: 'remove'},
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl(notification) {
    var {byUser, forPresent} = notification
    return (
      <div className="translations text-with-user">
        <User {...byUser} />
        <T>{`${byUser.gender}.hasRemoved`}</T>
        <User
          picture={forPresent.picture}
          name={forPresent.title}
        />
      </div>
    )
  }
}

export default present