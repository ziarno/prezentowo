import React from 'react'
import reactMixin from 'react-mixin'
import _ from 'underscore'

UserList = class UserList extends React.Component {

  constructor() {
    super()
    this.setCurrentUser = this.setCurrentUser.bind(this)
  }
  
  getMeteorData() {
    var event = Session.get('event')
    var currentUser = Session.get('currentUser')
    return {
      event,
      currentUser,
      isCreator: event.creatorId === Meteor.userId()
    }
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  setCurrentUser(user) {
    Session.set('currentUser', user)
  }

  render() {
    var event = this.data.event
    var isManyToOne = event.type === 'many-to-one'
    var participants = this.props.users
    var beneficiaries
    var beneficiariesTitle

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
                presentsCount={Presents.find({
                    forUserId: user._id
                  }).count()}
                isCreator={this.data.isCreator}
                onClick={this.setCurrentUser}
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
              count={this.props.presents.length}
            />
          </div>
        </div>

        <div
          className="user-list--list">
          {participants.map((user) => (
            <UserItem
              active={this.data.currentUser._id === user._id}
              presentsCount={Presents.find({
                forUserId: user._id
              }).count()}
              isCreator={this.data.isCreator}
              onClick={this.setCurrentUser}
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
  presents: React.PropTypes.array.isRequired
}

reactMixin(UserList.prototype, ReactMeteorData)