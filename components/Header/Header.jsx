import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'

Header = class Header extends Component {
  
  constructor() {
    super()
    this.getLoggedInNavigation = this.getLoggedInNavigation.bind(this)
    this.getLoggedOutNavigation = this.getLoggedOutNavigation.bind(this)
  }

  getLoggedInNavigation() {
    const {
      event,
      events,
      ready,
      user
    } = this.props
    return (
      <div id="navigation-container">
        <NavEvents
          event={event}
          events={events}
          ready={ready} 
        />
        <NavProfile {...user.profile} />
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
    const {
      title,
      user
    } = this.props
    return (
      <div className="app-header shadow">
        <div className="app-header--container">
          <h1 className="title">
            {title}
          </h1>
          {user ?
            this.getLoggedInNavigation() :
            this.getLoggedOutNavigation()
          }
        </div>
      </div>
    )
  }
}

Header = createContainer(({}) => {
  const eventId = FlowRouter.getParam('eventId')
  const event = Events.findOne(eventId)
  const user = Meteor.user()
  const title = event && user && event.title || 'Prezentowo'

  return {
    events: Events.find().fetch(),
    user,
    title,
    event
  }
}, Header)
