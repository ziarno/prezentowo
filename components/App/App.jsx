import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'
import {Autorun} from '../../lib/Mixins'
import reactMixin from 'react-mixin'

App = class App extends React.Component {

  constructor() {
    super()
    this.autorunSetTitle = this.autorunSetTitle.bind(this)
  }

  autorunSetTitle() {
    var eventId = FlowRouter.getParam('eventId')
    var userId = FlowRouter.getParam('userId')
    var event = Events.findOne(eventId)
    var eventTitle = event && event.title.capitalizeFirstLetter()
    var participant = Participants.findOne(userId)
    var participantName = participant && participant.profile.name.capitalizeFirstLetter()

    document.title =
      participantName ?
        `${participantName} - ${eventTitle}` :
      eventTitle ||
      'Prezentowo'
  }

  render() {
    var {ready, content, footer, className} = this.props
    return (
      <div
        id="app"
        className={className}>
        <Header
          ready={ready}
        />
        <div className="app-content">
          {content}
        </div>
        {footer ? footer : null}
      </div>
    )
  }
}

reactMixin(App.prototype, Autorun)

App = createContainer(() => {
  var userSubscription = Meteor.subscribe('userData')
  var eventsSubscription = Meteor.subscribe('events')
  return {
    ready: userSubscription.ready() && eventsSubscription.ready()
  }
}, App)