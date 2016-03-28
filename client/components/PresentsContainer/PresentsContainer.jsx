import React from 'react'
import {Autorun} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

PresentsContainer = class PresentsContainer extends React.Component {
  
  constructor() {
    super()
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
  }
  
  autorunSetCurrentUser() {
    var visibleUserIds = Session.get('visibleUserIds')
    var currentUser = _.find(this.props.users,
      user => _.contains(visibleUserIds, user._id))

    if (currentUser) {
      Session.set('currentUser', currentUser)
    }
  }

  render() {

    return (
      <div id="presents-container">

        {this.props.users.map((user) => (
          <UserPresents
            key={user._id}
            user={user}
            presents={this.props.presents.filter((present) => (
              present.forUserId === user._id
            ))}
          />
        ))}

      </div>
    )
  }
}

PresentsContainer.propTypes = {
  users: React.PropTypes.array.isRequired,
  presents: React.PropTypes.array.isRequired
}

reactMixin(PresentsContainer.prototype, Autorun)