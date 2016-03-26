import {Autorun} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'
import _ from 'underscore'

UserList = class UserList extends React.Component {
  
  constructor() {
    super()
    this.state = {event: {}}
    this.autorunSetCurrentUser = this.autorunSetCurrentUser.bind(this)
    this.autorunSetEvent = this.autorunSetEvent.bind(this)
    this.setSticky = this.setSticky.bind(this)
    this.scrollToUser = this.scrollToUser.bind(this)
  }
  
  autorunSetCurrentUser() {
    var currentUser = Session.get('currentUser')

    if (currentUser) {
      //note: do this manually because sticky was jumping
      //after user-item rerendering
      $(this.refs.userList)
        .find('.user-item--user')
        .removeClass('active')
        .parent()
        .find(`[data-id=${currentUser._id}]`)
        .parent()
        .addClass('active')
    }
  }

  autorunSetEvent() {
    this.setState({event: Session.get('event')})
  }

  setSticky() {
    $(this.refs.sticky).sticky({
      context: '#event-container',
      offset: 50
    })
  }

  shouldComponentUpdate(newProps, {event}) {
    return !_.isEqual(this.props, newProps) ||
      !_.isEqual(this.state.event.beneficiaryIds, event.beneficiaryIds)
  }

  scrollToUser(user) {
    var userPresentsEl = $(`#user-presents-${user._id}`)

    $(document.body).scrollTo(userPresentsEl, {
      duration: 1000,
      offset: -75,
      onAfter: () => {
        var userEl = userPresentsEl
          .find('.user')
          .addClass('waves-effect waves-button')

        Waves.ripple(userEl)
        Session.set('currentUser', user)
        setTimeout(() => {
          userEl.removeClass('waves-effect waves-button')
          Waves.calm(userEl)
        }, 2000)
      }
    })
  }

  componentDidMount() {
    this.setSticky()
  }

  componentDidUpdate() {
    this.setSticky()
  }

  render() {
    var event = this.state.event
    var isManyToOne = event.type === 'many-to-one'
    var participants = this.props.users
    var beneficiaries
    var beneficiariesTitle

    if (isManyToOne) {
      [beneficiaries, participants] = _.partition(
        this.props.users, u => event.beneficiaryIds.indexOf(u._id) > -1)
      beneficiariesTitle = beneficiaries.length > 1 ?
        'Beneficiaries' : 'Beneficiary'
    }

    return (
      <div
        id="user-list"
        ref="userList"
        className={classNames('shadow', {
          'many-to-one': isManyToOne
        })}>
        <div
          ref="sticky"
          className="ui sticky">


          {isManyToOne ? (
            <div
              className="user-list--title">
              <T>{beneficiariesTitle}</T>
            </div>
          ) : null}
          {isManyToOne ? (
            <div
              className="user-list--list">
              {beneficiaries.map((user) => (
                <UserItem
                  presentsCount={Presents.find({
                      forUserId: user._id
                    }).count()}
                  isCreator={this.props.isCreator}
                  onClick={this.scrollToUser}
                  key={user._id}
                  user={user} />
              ))}
            </div>
          ) : null}



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
            {participants.map((user) => (
              <UserItem
                presentsCount={Presents.find({
                  forUserId: user._id
                }).count()}
                isCreator={this.props.isCreator}
                onClick={this.scrollToUser}
                key={user._id}
                user={user} />
            ))}
          </div>

        </div>
      </div>
    )
  }
  
}

UserList.propTypes = {
  users: React.PropTypes.array.isRequired,
  presents: React.PropTypes.array.isRequired,
  isCreator: React.PropTypes.bool
}

reactMixin(UserList.prototype, Autorun)