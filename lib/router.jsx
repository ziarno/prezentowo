FlowRouter.notFound = {
  action() {
    console.warn('404 :(')
  }
}

FlowRouter.route('/', {
  action() {
    ReactLayout.render(App)
  }
})

FlowRouter.route('/event/id/:eventId', {
  action() {
    ReactLayout.render(App, {
      content: <EventContainer />
    })
  }
})