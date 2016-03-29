import React from 'react'
import {mount} from 'react-mounter'

FlowRouter.notFound = {
  action() {
    console.warn('404 :(')
  }
}

FlowRouter.route('/', {
  action() {
    mount(App)
  }
})

FlowRouter.route('/event/id/:eventId', {
  action({eventId}) {
    mount(App, {
      content: <EventContainer eventId={eventId} />
    })
  }
})