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
  action() {
    mount(App, {
      content: <EventContainer />
    })
  }
})