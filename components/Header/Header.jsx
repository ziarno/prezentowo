import {Autorun} from '../../lib/Mixins';

Header = React.createClass({

  mixins: [ReactMeteorData, Autorun],

  getMeteorData() {
    var eventsSubscribtion = Meteor.subscribe('events');

    return {
      ready: eventsSubscribtion.ready(),
      events: Events.find().fetch(),
      user: Meteor.user()
    };
  },

  getInitialState() {
    return {
      title: 'Prezentowo'
    }
  },

  autorun() {
    var eventId = FlowRouter.getParam('eventId');
    var event = Events.findOne(eventId);
    var title;

    if (!eventId) {
      title = 'Prezentowo';
    } else {
      title = event && event.title || '';
    }

    this.setState({title});
  },

  getLoggedInNavigation() {
    return (
      <div id="navigation-container">
        <EventsButton
          events={this.data.events}
          ready={this.data.ready} />
        <UserProfileButton
          {...this.data.user.profile} />
      </div>
    );
  },

  getLoggedOutNavigation() {
    return (
      <div id="navigation-container">
        <LoginOrRegisterButton />
      </div>
    );
  },

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
    );
  }

});
