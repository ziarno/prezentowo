import React from 'react'
import reactMixin from 'react-mixin'
import _ from 'underscore'
import {createContainer} from 'meteor/react-meteor-data'

UserList = class UserList extends React.Component {

  render() {
    var event = this.props.event
    var isManyToOne = event.type === 'many-to-one'
    var beneficiariesTitle
    var activeUserId = this.props.activeUser &&
      this.props.activeUser._id

    var Counts = (
      <div className="counts">
        <CountLabel
          tooltip={_i18n.__('Participants count')}
          icon="user"
          className="basic"
          count={this.props.users.length}
        />
        <CountLabel
          tooltip={_i18n.__('Presents count')}
          icon="gift"
          className="basic"
          count={Events.functions.getPresentsCount(event)}
        />
      </div>
    )

    var [BeneficiariesUserItems, ParticipantsUserItems] = _(this.props.users)
      .partition(
        user => isManyToOne && event.beneficiaryIds.indexOf(user._id) > -1
      )
      .map((userGroup) => (
        userGroup.map((user) => (
          <UserItem
            active={activeUserId === user._id}
            disabled={isManyToOne}
            presentsCount={
              !isManyToOne &&
              Users.functions.getPresentsCount(user)}
            isCreator={this.props.isCreator}
            onClick={this.props.onUserSelect}
            key={user._id}
            user={user} />
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