import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'

Header = class Header extends React.Component {
  
  constructor() {
    super()
    this.getLoggedInNavigation = this.getLoggedInNavigation.bind(this)
    this.getLoggedOutNavigation = this.getLoggedOutNavigation.bind(this)
  }

  getLoggedInNavigation() {
    return (
      <div id="navigation-container">
        <NavEvents
          event={this.props.event}
          events={this.props.events}
          ready={this.props.ready} />
        <NavProfile
          {...this.props.user.profile} />
      </div>
    )
  }

  getLoggedOutNavigation() {
    return (
      <div id="navigation-container">
        <LoginOrRegisterButton />
      </div>
    )
  }

  render() {
    return (
      <div className="app-header shadow">
        <div className="app-header--container">
          <h1 className="title">
            {this.props.title}
          </h1>
          {this.props.user ?
            this.getLoggedInNavigation() :
            this.getLoggedOutNavigation()}
        </div>
      </div>
    )
  }
}

Header = createContainer(({}) => {
  var event = Session.get('event')
  return {
    events: Events.find().fetch(),
    user: Meteor.user(),
    title: event.title || 'Prezentowo',
    event
  }
}, Header)