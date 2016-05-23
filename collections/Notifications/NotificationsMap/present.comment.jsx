import React from 'react'
import present from './present'
import {
  getByUser,
  getEventParticipants,
  getEventBeneficiaries,
  getForUser
} from './userFilters'

var presentComment = {
  secret: {},
  shared: {}
}

function getMessageEl(notification) {
  var {byUser, forPresent} = notification
  return (
    <div className="translations text-with-user">
      <User {...byUser} />
      <T>{`${byUser.gender}.hasAdded`}</T>
      <T>a message</T>
      <T>in</T>
      <User
        picture={forPresent.picture}
        name={forPresent.title}
      />
    </div>
  )
}

presentComment.secret.added = {
  usersFilter: function (notificationData) {
    var {event} = notificationData
    var isManyToOne = event.type === 'many-to-one'

    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData),
      isManyToOne &&
        getEventBeneficiaries(notificationData),
      getForUser(notificationData)
    )
  },
  icon: {main: 'comment outline'},
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl
}

presentComment.shared.added = {
  usersFilter: function (notificationData) {
    return _.difference(
      getEventParticipants(notificationData),
      getByUser(notificationData)
    )
  },
  icon: {main: 'comment outline'},
  hasPicture: true,
  getPicture: present.added.getPicture,
  getMessageEl
}


export default presentComment