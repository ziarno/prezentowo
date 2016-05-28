import React from 'react'
import {mount} from 'react-mounter'

function showEvent(params) {
  ModalManager.destroy()
  mount(App, {
    content: <EventContainer {...params} />
  })
}

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
  action: showEvent
})

FlowRouter.route('/event/id/:eventId/user/:userId', {
  action: showEvent
})