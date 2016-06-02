import React from 'react'
import {mount} from 'react-mounter'

FlowRouter.notFound = {
  action() {
    console.warn('404 :(')
  }
}

FlowRouter.route('/', {
  action() {
    mount(App, {
      className: 'home-view',
      content: <HomePage />
    })
  }
})

FlowRouter.route('/event/id/:eventId', {
  action: function (params) {
    ModalManager.destroy()
    mount(App, {
      className: 'event-view',
      content: <EventContainer {...params} />
    })
  }
})

FlowRouter.route('/event/id/:eventId/user/:userId', {
  action: function (params) {
    ModalManager.destroy()
    mount(App, {
      className: 'event-view participant-view',
      content: <EventContainer {...params} />
    })
  }
})