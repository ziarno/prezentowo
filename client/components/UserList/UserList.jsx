UserList = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    users: React.PropTypes.array.isRequired,
    presents: React.PropTypes.array.isRequired,
    isCreator: React.PropTypes.bool.isRequired
  },

  getMeteorData() {
    var eventId = FlowRouter.getParam('eventId');

    return {
      event: Events.findOne(eventId),
      user: Meteor.user()
    };
  },

  setSticky() {
    $(this.refs.sticky).sticky({
      context: '#event-container',
      offset: 50
    });
  },

  scrollToUser(userId) {
    var userPresentsEl = $(`[data-user-id='${userId}']`);

    clearTimeout(this.rippleTimeout);

    $('body').scrollTo(userPresentsEl, {
      duration: 1000,
      offset: -75,
      onAfter() {
        var userEl = userPresentsEl
          .find('.user')
          .addClass('waves-effect waves-button');

        Waves.ripple(userEl);
        this.rippleTimeout = setTimeout(() => {
          userEl.removeClass('waves-effect waves-button');
          Waves.calm(userEl);
        }, 2000);
      }
    });
  },

  componentDidMount() {
    this.setSticky();
  },

  componentDidUpdate() {
    this.setSticky();
  },

  render() {

    return (
      <div
        id="user-list"
        className="shadow">
        <div
          ref="sticky"
          className="ui sticky">

          <div
            className="user-list--title">
            <T>Participants</T>
            <div className="counts">
              <CountLabel
                icon="user"
                className="basic"
                count={this.props.users.length}
              />
              <CountLabel
                icon="gift"
                className="basic"
                count={this.props.presents.length}
              />
            </div>
          </div>

          <div
            className={classNames('user-list--list', {
              'user-list--list__with-settings': this.props.isCreator
            })}>
            {this.props.users.map((user) => (
              <UserItem
                presentsCount={Presents.find({
                  forUserId: user._id
                }).count()}
                onClick={this.scrollToUser}
                key={user._id}
                user={user} />
            ))}
          </div>

        </div>
      </div>
    );
  }
});