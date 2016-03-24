import reactMixin from 'react-mixin'

EventContainer = class EventContainer extends React.Component {
  
  constructor() {
    super()
    this.isCreator = this.isCreator.bind(this)
  }
  
  getMeteorData() {
    var eventId = FlowRouter.getParam('eventId')
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

    return {
      ready: subscription.ready(),
      presents: Presents.find().fetch(),
      participants,
      event
    }
  }

  isCreator() {
    return this.data.event &&
      (this.data.event.creatorId === Meteor.userId())
  }

  render() {

    var eventTitle = this.data.event
      && this.data.event.title

    return this.data.ready ? (
      <div id="event-container">
        <UserList
          isCreator={this.isCreator()}
          users={this.data.participants}
          presents={this.data.presents} />
        <PresentsContainer
          users={this.data.participants}
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
          users={this.data.participants}
        />
      </div>
    ) : (
      <div id="event-container">
        <Loader
          size="large"
          text={eventTitle ?
            _i18n.__('Loading event', {title: eventTitle}) :
            null}
        />
      </div>
    )
  }
  
}

reactMixin(EventContainer.prototype, ReactMeteorData)