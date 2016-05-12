import React from 'react'
import reactMixin from 'react-mixin'
import _ from 'underscore'
import {createContainer} from 'meteor/react-meteor-data'

UserList = class UserList extends React.Component {

  render() {
    var {event} = this.props
    var isManyToOne = event.type === 'many-to-one'
    var isUserParticipant = Events.functions
        .isUserParticipant({
          eventId: event._id,
          participantId: Meteor.userId()
        })
    var beneficiariesTitle
    var activeUserId = this.props.activeUser &&
      this.props.activeUser._id

    var Counts = (
      <div className="counts">
        <CountLabel
          tooltip="Participants count"
          icon="user"
          className="basic"
          count={this.props.users.length}
        />
        <CountLabel
          tooltip="Presents count"
          icon="gift"
          className="basic"
          count={Events.functions.getPresentsCount(event)}
        />
      </div>
    )

    var [BeneficiariesUserItems, ParticipantsUserItems] =
      _(this.props.users)
      .partition(
        user => isManyToOne &&
          event.beneficiaryIds.indexOf(user._id) > -1
      )
      .map(userGroup => (
        userGroup
          .filter(user => (
            (this.props.isCreator &&
             user.status !== 'isRemoved') ||
            user.status === 'isAccepted' ||
            user.status === 'isInvited'
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
                disabled={isManyToOne || !isUserParticipant}
                presentsCount={
                  !isManyToOne &&
                  Users.functions.getPresentsCount(user)}
                showEditButton={this.props.isCreator}
                onClick={this.props.onUserSelect}
                key={user._id}
                user={user} />
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
        })}>

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
  users: React.PropTypes.array.isRequired,
  activeUser: React.PropTypes.object,
  onUserSelect: React.PropTypes.func.isRequired
}

UserList = createContainer(() => {
  var event = Session.get('event')
  var activeUser = Session.get('currentUser')
  return {
    activeUser,
    event,
    isCreator: event.creatorId === Meteor.userId()
  }
}, UserList)