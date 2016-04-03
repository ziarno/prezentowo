import React from 'react'
import ReactDOM from 'react-dom'

UserPresents = class UserPresents extends React.Component {

  constructor() {
    super()
    this.setVisibleUsers = this.setVisibleUsers.bind(this)
    this.setScrollSpy = this.setScrollSpy.bind(this)
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
    var getPresents = (title, presents) => {
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
                viewMode={this.props.presentViewMode}
                key={present._id}
                present={present} />
            ))}
          </div>
        </div>
      )
    }

    this.props.presents.forEach((present) => {
      if (present.isOwn()) {
        ownPresents.push(present)
      } else {
        otherPresents.push(present)
      }
    })

    return (
      <div
        id={`user-presents-${this.props.user._id}`}
        className="user-presents">

        <div className="ui horizontal divider">
          <User user={this.props.user} large showAddPresentOnHover />
        </div>

        {getPresents('hints.ownPresents', ownPresents)}
        {getPresents('hints.otherPresents', otherPresents)}

      </div>
    )
  }
}

UserPresents.propTypes = {
  user: React.PropTypes.object.isRequired,
  presents: React.PropTypes.array.isRequired,
  presentViewMode: React.PropTypes.string
}