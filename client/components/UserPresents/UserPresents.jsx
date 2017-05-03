import React, { Component, PropTypes } from 'react'
import _ from 'underscore'
import { _i18n } from 'meteor/universe:i18n'

UserPresents = class UserPresents extends Component {

  static getPresents({title, presents, viewMode}) {
    if (!presents.length) {
      return null
    }
    return (
      <div>
        <h2>
          <T>{title}</T>
        </h2>
        <div className="ui cards presents">
          {presents.map((present) => (
            <Present
              viewMode={viewMode}
              key={present._id}
              present={present} />
            ))
          }
        </div>
      </div>
    )
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(newProps, this.props)
  }

  render() {
    const {
      presents,
      users,
      presentViewMode,
    } = this.props
    const [ownPresents, otherPresents] = _.partition(
      presents,
      p => p.isOwn
    )

    return (
      <div
        id={`user-presents-${users &&
          users.length === 1 &&
          users[0]._id}`}
        className="user-presents"
      >

        <HorizontalDivider>
          {users.map(user => (
            <User
              showAddPresentOnHover={users.length === 1}
              key={user._id}
              user={user}
              large
            />
          ))}
        </HorizontalDivider>

        {users.length > 1 ? (
          <PresentPopup
            icon={<i className="ui plus icon" />}
            buttonClassName="right labeled compact"
            buttonText={_i18n.__('Add present')}
            users={[] /* must be a many-to-one event because many users */}
          />
        ) : null}

        {UserPresents.getPresents({
          title: 'hints.ownPresents',
          presents: ownPresents,
          viewMode: presentViewMode
        })}
        {UserPresents.getPresents({
          title: 'hints.otherPresents',
          presents: otherPresents,
          viewMode: presentViewMode
        })}

      </div>
    )
  }
}

UserPresents.propTypes = {
  users: PropTypes.array,
  presents: PropTypes.array.isRequired,
  presentViewMode: PropTypes.string
}
