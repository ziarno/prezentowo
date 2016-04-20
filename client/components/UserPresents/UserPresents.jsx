import React from 'react'
import ReactDOM from 'react-dom'

UserPresents = class UserPresents extends React.Component {

  constructor() {
    super()
    this.setVisibleUsers = this.setVisibleUsers.bind(this)
    this.setScrollSpy = this.setScrollSpy.bind(this)
  }

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

  setVisibleUsers(event, ...visibleUsers) {
    var visibleUserIds = _.map(visibleUsers, user => (
      $(user).attr('data-id')
    ))

    Session.set('visibleUserIds', visibleUserIds)
  }

  setScrollSpy() {
    $(ReactDOM.findDOMNode(this))
      .find('.user')
      .scrollSpy({
        offsetTop: 100,
        offsetBottom: -100,
        throttle: 1000
      })
  }

  componentDidMount() {
    this.setScrollSpy()
    $(ReactDOM.findDOMNode(this))
      .find('.user')
      .on('scrollSpy:enter scrollSpy:exit', this.setVisibleUsers)
  }

  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this))
      .find('.user')
      .off('scrollSpy:enter scrollSpy:exit', this.setVisibleUsers)
  }

  render() {
    var ownPresents = []
    var otherPresents = []

    this.props.presents.forEach((present) => {
      if (present.isOwn) {
        ownPresents.push(present)
      } else {
        otherPresents.push(present)
      }
    })

    return (
      <div
        id={`user-presents-${this.props.users &&
          this.props.users.length === 1 &&
          this.props.users[0]._id}`}
        className="user-presents">

        <HorizontalDivider>
          {this.props.users.map(user => (
            <User
              showAddPresentOnHover={this.props.users.length === 1}
              key={user._id}
              user={user}
              large />
          ))}
        </HorizontalDivider>

        {this.props.users.length > 1 ? (
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
          viewMode: this.props.presentViewMode
        })}
        {UserPresents.getPresents({
          title: 'hints.otherPresents',
          presents: otherPresents,
          viewMode: this.props.presentViewMode
        })}

      </div>
    )
  }
}

UserPresents.propTypes = {
  users: React.PropTypes.array,
  presents: React.PropTypes.array.isRequired,
  presentViewMode: React.PropTypes.string
}