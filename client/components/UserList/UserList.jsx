import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import _ from 'underscore'
import { classNames } from 'meteor/maxharris9:classnames'
import { createContainer } from 'meteor/react-meteor-data'

UserList = class UserList extends Component {

  render() {
    const {
      event,
      activeUser,
      users,
      isCreator,
      onUserSelect,
    } = this.props
    const isManyToOne = event.type === 'many-to-one'
    const isUserAcceptedParticipant = Events.functions
      .participant({
        event,
        participantId: Meteor.userId()
      })
      .isAccepted()
    let beneficiariesTitle
    const activeUserId = activeUser && activeUser._id

    const Counts = (
      <div className="counts">
        <CountLabel
          tooltip="Participants count"
          icon="user"
          className="basic"
          count={event.participantsCount}
        />
        <CountLabel
          tooltip="Presents count"
          icon="gift"
          className="basic"
          count={Events.functions.getPresentsCount(event)}
        />
      </div>
    )

    const [BeneficiariesUserItems, ParticipantsUserItems] =
      _(users)
      .partition(
        user => isManyToOne &&
          event.beneficiaryIds.indexOf(user._id) > -1
      )
      .map(userGroup => (
        userGroup
          .filter(user => (
            (isCreator && user.status !== 'isRemoved') ||
            user.status === 'isAccepted' ||
            user.status === 'isInvited' ||
            user.status === 'isTemp'
          ))
          .map(user => (
            user.status === 'requestingJoin' ? (
              <UserItemAcceptPopup
                key={user._id}
                user={user}
              />
            ) : (
              <UserItem
                active={activeUserId === user._id}
                disabled={isManyToOne || !isUserAcceptedParticipant}
                presentsCount={
                  !isManyToOne &&
                  Users.functions.getPresentsCount(user)}
                showEditButton={isCreator}
                onClick={onUserSelect}
                key={user._id}
                user={user}
              />
            )
          ))
      ))

    beneficiariesTitle = BeneficiariesUserItems &&
      BeneficiariesUserItems.length > 1 ?
      'Beneficiaries' : 'Beneficiary'

    return (
      <div
        ref="userList"
        className={classNames('user-list', {
          'many-to-one': isManyToOne
        })}
      >

        {isManyToOne ? (
          <div
            className="user-list--title">
            <T>{beneficiariesTitle}</T>
            {Counts}
          </div>
        ) : null}
        {isManyToOne ? (
          <div
            className="user-list--list">
            {BeneficiariesUserItems}
          </div>
        ) : null}

        <div
          className="user-list--title">
          <T>Participants</T>
          {!isManyToOne ? Counts : null}
        </div>
        <div
          className="user-list--list">
          {ParticipantsUserItems}
        </div>

      </div>
    )
  }
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  activeUser: PropTypes.object,
  onUserSelect: PropTypes.func.isRequired
}

UserList = createContainer(() => {
  const event = Session.get('event')
  const activeUser = Session.get('currentUser')
  return {
    activeUser,
    event,
    isCreator: event.creatorId === Meteor.userId()
  }
}, UserList)
