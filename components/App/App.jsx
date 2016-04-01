import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'

App = class App extends React.Component {
  render() {
    return (
      <div>
        <Header
          ready={this.props.ready}
        />
        <div className="app-content">
          {this.props.content}
        </div>
      </div>
    )
  }
}

App = createContainer(() => {
  var userSubscription = Meteor.subscribe('userData')
  var eventsSubscription = Meteor.subscribe('events')
  return {
    ready: userSubscription.ready() && eventsSubscription.ready()
  }
}, App)