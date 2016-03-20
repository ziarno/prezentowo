import {Autorun} from '../../../lib/Mixins';

UserList = React.createClass({

  mixins: [Autorun],

  propTypes: {
    users: React.PropTypes.array.isRequired,
    presents: React.PropTypes.array.isRequired
  },

  autorunSetCurrentUser() {
    var currentUser = Session.get('currentUser');

    if (currentUser) {
      //note: do this manually because sticky was jumping
      //after user-item rerendering
      $(this.refs.userList)
        .find('.user-item')
        .removeClass('active')
        .parent()
        .find(`[data-id=${currentUser._id}]`)
        .parent()
        .addClass('active');
    }
  },

  setSticky() {
    $(this.refs.sticky).sticky({
      context: '#event-container',
      offset: 50
    });
  },

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps);
  },

  scrollToUser(user) {
    var userPresentsEl = $(`#user-presents-${user._id}`);

    $(document.body).scrollTo(userPresentsEl, {
      duration: 1000,
      offset: -75,
      onAfter: () => {
        var userEl = userPresentsEl
          .find('.user')
          .addClass('waves-effect waves-button');

        Waves.ripple(userEl);
        Session.set('currentUser', user);
        setTimeout(() => {
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
        ref="userList"
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
            className="user-list--list">
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