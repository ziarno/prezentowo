import React from 'react'
import {Autorun} from '../../lib/Mixins'
import reactMixin from 'react-mixin'

EventContainer = class EventContainer extends React.Component {
  
  constructor() {
    super()
    this.state = {
      isSidebarVisible: $(window).width() > 720,
      currentUser: Session.get('currentUser')
    }
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
  }

  getMeteorData() {
    var eventId = this.props.eventId
    var event = Events.findOne(eventId)
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
    Session.set('event', event || {})

    return {
      ready: subscription.ready(),
      presents: Presents.find().fetch(),
      participants,
      event
    }
  }

  autorunSetCurrentUser() {
    this.setState({currentUser: Session.get('currentUser')})
  }

  render() {
    var eventTitle = Session.get('event').title

    if (!this.data.ready) {
      return (
        <Loader
          size="large"
          text={eventTitle ?
            _i18n.__('Loading event', {title: eventTitle}) :
          null}
        />
      )
    }

    return (
      <div
        id="event-container"
        className={classNames({
          padded: this.state.isSidebarVisible
        })}>

        <Sidebar
          scrollToEl={`.user-list [data-id=${this.state.currentUser._id}]`}
          initiallyVisible={this.state.isSidebarVisible}
          onVisibilityChange={isSidebarVisible =>
            this.setState({isSidebarVisible})}>
          <UserList
            users={this.data.participants}
            presents={this.data.presents} />
        </Sidebar>

        <PresentsContainer
          scrollToEl={`#user-presents-${this.state.currentUser._id}`}
          users={this.data.participants}
          presents={this.data.presents} />

        <PresentPopup
          buttonClassName="present-button--add circular primary"
          wrapperClassName="add-present-button"
          defaultSelectedUser={this.state.currentUser}
          icon={(
            <i className="large icons">
              <i className="plus icon"></i>
              <i className="gift corner inverted icon"></i>
            </i>
          )}
          users={this.data.participants}
        />

      </div>
    )
  }
  
}

EventContainer.propTypes = {
  eventId: React.PropTypes.string.isRequired
}

reactMixin(EventContainer.prototype, ReactMeteorData)
reactMixin(EventContainer.prototype, Autorun)
