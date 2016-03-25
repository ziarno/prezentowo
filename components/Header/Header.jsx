import {Autorun} from '../../lib/Mixins'
import reactMixin from 'react-mixin'

Header = class Header extends React.Component {
  
  constructor() {
    super()
    this.state = {
      title: 'Prezentowo'
    }
    this.autorunSetTitle = this.autorunSetTitle.bind(this)
    this.getLoggedInNavigation = this.getLoggedInNavigation.bind(this)
    this.getLoggedOutNavigation = this.getLoggedOutNavigation.bind(this)
  }
  
  getMeteorData() {
    var eventsSubscribtion = Meteor.subscribe('events')

    return {
      ready: eventsSubscribtion.ready(),
      events: Events.find().fetch(),
      user: Meteor.user()
    }
  }
  
  autorunSetTitle() {
    this.setState({
      title: Session.get('event').title || 'Prezentowo'
    })
  }

  getLoggedInNavigation() {
    return (
      <div id="navigation-container">
        <EventsButton
          events={this.data.events}
          ready={this.data.ready} />
        <UserProfileButton
          {...this.data.user.profile} />
      </div>
    )
  }

  getLoggedOutNavigation() {
    return (
      <div id="navigation-container">
        <LoginOrRegisterButton />
      </div>
    )
  }

  render() {
    return (
      <div className="app-header shadow">
        <div className="app-header--container">
          <h1 className="title">
            {this.state.title}
          </h1>
          {this.data.user ?
            this.getLoggedInNavigation() :
            this.getLoggedOutNavigation()}
        </div>
      </div>
    )
  }

}

reactMixin(Header.prototype, ReactMeteorData)
reactMixin(Header.prototype, Autorun)