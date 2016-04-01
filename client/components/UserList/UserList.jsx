import React from 'react'
import reactMixin from 'react-mixin'
import _ from 'underscore'
import {createContainer} from 'meteor/react-meteor-data'

UserList = class UserList extends React.Component {

  render() {
    var event = this.props.event
    var isManyToOne = event.type === 'many-to-one'
    var participants = this.props.users
    var beneficiaries
    var beneficiariesTitle
    var activeUserId = this.props.activeUser &&
      this.props.activeUser._id

    if (isManyToOne) {
      [beneficiaries, participants] = _.partition(
        this.props.users, u => event.beneficiaryIds.indexOf(u._id) > -1)
      beneficiariesTitle = beneficiaries.length > 1 ?
        'Beneficiaries' : 'Beneficiary'
    }

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
          </div>
        ) : null}
        {isManyToOne ? (
          <div
            className="user-list--list">
            {beneficiaries.map((user) => (
              <UserItem
                presentsCount={Users.functions.getPresentsCount(user)}
                isCreator={this.props.isCreator}
                key={user._id}
                user={user} />
            ))}
          </div>
        ) : null}

        <div
          className="user-list--title">
          <T>Participants</T>
          <div className="counts">
            <CountLabel
              icon="user"
              className="basic"
              count={this.props.users.length}
            />
            <CountLabel
              icon="gift"
              className="basic"
              count={Events.functions.getPresentsCount(event)}
            />
          </div>
        </div>

        <div
          className="user-list--list">
          {participants.map((user) => (
            <UserItem
              active={activeUserId === user._id}
              presentsCount={Users.functions.getPresentsCount(user)}
              isCreator={this.props.isCreator}
              onClick={this.props.onUserSelect}
              key={user._id}
              user={user} />
          ))}
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
  return {
    activeUser: Session.get('currentUser'),
    event,
    isCreator: event.creatorId === Meteor.userId()
  }
}, UserList)