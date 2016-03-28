import React from 'react'
import {Autorun} from '../../lib/Mixins'
import reactMixin from 'react-mixin'

EventContainer = class EventContainer extends React.Component {
  
  constructor() {
    super()
    this.state = {
      isSidebarVisible: true
    }
    this.isCreator = this.isCreator.bind(this)
    this.autorunSetEvent = this.autorunSetEvent.bind(this)
    this.onSidebarVisibilityChange = this.onSidebarVisibilityChange.bind(this)
  }
  
  getMeteorData() {
    var event = Session.get('event')
    var eventId = event._id
    var subscription = Meteor.subscribe('eventDetails', {eventId})
    var participants = Participants
      .find()
      .fetch()
      .sort((participant1, participant2) => {
        var name1 = participant1.profile.name.capitalizeFirstLetter()
        var name2 = participant2.profile.name.capitalizeFirstLetter()

        return name1 > name2 ? 1 : -1
      })

    //move current user to the top
    participants.moveToTop((participant) => (
      participant._id === Meteor.userId()
    ))

    Session.set('participants', participants)

    return {
      ready: subscription.ready(),
      presents: Presents.find().fetch()
    }
  }

  autorunSetEvent() {
    var eventId = FlowRouter.getParam('eventId')
    var event = Events.findOne(eventId)

    Session.set('event', event || {})
  }

  onSidebarVisibilityChange(isSidebarVisible) {
    this.setState({isSidebarVisible})
  }

  isCreator() {
    return Session.get('event').creatorId === Meteor.userId()
  }

  render() {
    var eventTitle = Session.get('event').title

    return this.data.ready ? (
      <div
        id="event-container"
        className={classNames({
          padded: this.state.isSidebarVisible
        })}>
        <Sidebar
          initiallyVisible={this.state.isSidebarVisible}
          onVisibilityChange={this.onSidebarVisibilityChange}>
          <UserList
            isCreator={this.isCreator()}
            users={Session.get('participants')}
            presents={this.data.presents} />
        </Sidebar>
        <PresentsContainer
          users={Session.get('participants')}
          presents={this.data.presents} />
        <PresentPopup
          buttonClassName="present-button--add circular primary"
          wrapperClassName="add-present-button"
          icon={(
            <i className="large icons">
              <i className="plus icon"></i>
              <i className="gift corner inverted icon"></i>
            </i>
          )}
          users={Session.get('participants')}
        />
      </div>
    ) : (
      <Loader
        size="large"
        text={eventTitle ?
          _i18n.__('Loading event', {title: eventTitle}) :
          null}
      />
    )
  }
  
}

reactMixin(EventContainer.prototype, ReactMeteorData)
reactMixin(EventContainer.prototype, Autorun)
