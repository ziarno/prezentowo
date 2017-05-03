import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { createContainer } from 'meteor/react-meteor-data'
import reactMixin from 'react-mixin'
import { Autorun } from '../../lib/Mixins'

App = class App extends Component {

  constructor() {
    super()
    this.autorunSetTitle = this.autorunSetTitle.bind(this)
  }

  autorunSetTitle() {
    const eventId = FlowRouter.getParam('eventId')
    const userId = FlowRouter.getParam('userId')
    const event = Events.findOne(eventId)
    const eventTitle = event && event.title.capitalizeFirstLetter()
    const participant = Participants.findOne(userId)
    const participantName = participant && participant.profile.name.capitalizeFirstLetter()

    document.title =
      participantName ?
        `${participantName} - ${eventTitle}` :
      eventTitle ||
      'Prezentowo'
  }

  render() {
    const {
      ready,
      content,
      footer,
      className
    } = this.props

    return (
      <div
        id="app"
        className={className}
      >
        <Header ready={ready} />
        <div className="app-content">
          {content}
        </div>
        {footer || null}
      </div>
    )
  }
}

App.propTypes = {
  ready: PropTypes.bool,
  content: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string
}

reactMixin(App.prototype, Autorun)

App = createContainer(() => {
  const userSubscription = Meteor.subscribe('userData')
  const eventsSubscription = Meteor.subscribe('events')
  return {
    ready: userSubscription.ready() && eventsSubscription.ready()
  }
}, App)
