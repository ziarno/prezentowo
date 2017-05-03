import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { $ } from 'meteor/jquery'
import { classNames } from 'meteor/maxharris9:classnames'
import { createContainer } from 'meteor/react-meteor-data'
import _ from 'underscore'

PresentDetailsModal = class PresentDetailsModal extends Component {

  constructor({presentId}) {
    super()

    //note: don't put this in `createContainer` - situation:
    //when other user removes a present we are currently viewing,
    //then createContainer wants to run first
    // -> doesn't find the removed present
    // -> query listener gets overridden by listener for
    // an empty present
    this.observeHandle = Presents
      .find({ _id: presentId })
      .observeChanges({
        removed() {
          //destroy, to immediately stop this component
          //from rendering an unexisting present
          ModalManager.close()
          ModalManager.destroy()
        }
      })

    this.toggleBuyer = this.toggleBuyer.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendSecretMessage = this.sendSecretMessage.bind(this)
    this.sendSharedMessage = this.sendSharedMessage.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  toggleBuyer() {
    const {
      presentId,
      present
    } = this.props
    const action = !present.isUserBuyer()

    Presents.methods.setBuyer.call({
      presentId,
      action
    })
  }

  sendMessage({ message, type }) {
    const { presentId } = this.props

    Comments.methods.createComment.call({
      presentId,
      type,
      message
    })
  }

  sendSecretMessage(message) {
    this.sendMessage({type: 'secret', message})
  }

  sendSharedMessage(message) {
    this.sendMessage({type: 'shared', message})
  }

  showPresent(presentId) {
    presentId && ModalManager.render(
      <PresentDetails presentId={presentId} />,
      'present-details'
    )
  }

  handleKeyUp(e) {
    const {
      previousPresentId,
      nextPresentId
    } = this.props
    const KEYCODE_LEFT = 37
    const KEYCODE_RIGHT = 39
    const srcElName = (e.target && e.target.localName) ||
      e.srcElement.localName
    const presentToShowMap = {
      [KEYCODE_LEFT]: previousPresentId,
      [KEYCODE_RIGHT]: nextPresentId
    }
    const presentToShow = presentToShowMap[e.keyCode]

    if (['input', 'textarea'].includes(srcElName)) {
      return
    }

    this.showPresent(presentToShow)
  }

  setModalShadow() {
    //note: needs to be toggled manually, because semantic adds its
    //own classes to the modal, and react overrides them all
    //if we wanna change at least 1
    $(ReactDOM.findDOMNode(this))
      .toggleClass(
        'no-shadow',
        !this.props.presentReadyToShow
      )
  }

  componentDidUpdate({present, presentReadyToShow}) {
    const newPresent = _.omit(this.props.present,
      ['commentsShared', 'commentsSecret'])
    const oldPresent = _.omit(present,
      ['commentsShared', 'commentsSecret'])

    if (!_.isEqual(oldPresent, newPresent) ||
      presentReadyToShow !== this.props.presentReadyToShow) {
      ModalManager.refresh()
    }
    this.setModalShadow()
  }

  componentWillUnmount() {
    this.observeHandle.stop()
    document.body.removeEventListener('keyup', this.handleKeyUp)
  }

  componentDidMount() {
    document.body.addEventListener('keyup', this.handleKeyUp)
    this.setModalShadow()
  }

  render() {
    const {
      event,
      present,
      forUsers,
      creator,
      buyers,
      commentsReady,
      presentReadyToShow,
      previousPresentId,
      nextPresentId
    } = this.props

    if (!presentReadyToShow) {
      return (
        <Modal>
          <Loader />
        </Modal>
      )
    }

    const isUserBuyer = present.isUserBuyer()
    const isUserBeneficiary =
      _.contains(event.beneficiaryIds, Meteor.userId())
    const isUserCreator = present.creatorId === Meteor.userId()
    const canUserBuy =
      !(present.isOwn && isUserCreator) && !isUserBeneficiary
    const commentsShared = present.commentsShared &&
      Comments
        .find(
          { _id: { $in: present.commentsShared } },
          { sort: { createdAt: 1 } }
        )
        .fetch()
    const commentsSecret = present.commentsSecret &&
      Comments
        .find(
          { _id: { $in: present.commentsSecret } },
          { sort: { createdAt: 1 } }
        )
        .fetch()
    const BuyersMessage = (
      <span>
        <T>Buyers</T>
        <span>:</span>
        {buyers && buyers.map(buyer => (
          <User user={buyer} key={buyer._id} />
        ))}
      </span>
    )

    return (
      <Modal
        ribbon
        ribbonColor={classNames({
          red: !present.isOwn
        })}
        title={present.title}
      >
        <Message
          hidden={!buyers}
          className="top-message small olive icon"
          icon="dollar"
          messageEl={BuyersMessage}
        />

        {previousPresentId ? (
          <ArrowField
            onClick={() => this.showPresent(previousPresentId)}
            left
            rounded
          />
        ) : null}
        {nextPresentId ? (
          <ArrowField
            onClick={() => this.showPresent(nextPresentId)}
            right
            rounded
          />
        ) : null}

        <div className="present-details--content">
          <div className="present-details--image">
            <Img
              src={present.picture.small}
              modalSrc={present.picture.large}
              className="waves-effect"
            />
              <div className="present-details--buttons">
                {present.isUserCreator() ? (
                  <PresentPopup
                    present={present}
                    icon={<i className="ui vertical ellipsis icon" />}
                    wrapperClassName="edit-present"
                    buttonClassName="left labeled compact"
                    buttonText="Edit present"
                    users={forUsers && forUsers.length === 1 ?
                      [forUsers[0]] : []}
                    onRemove={ModalManager.close}
                    popupSettings={{
                      position: 'bottom center',
                      inline: true,
                      target: '.modal .ribbon ',
                      transition: 'slide down'
                    }}
                  />
                ) : null}
                {canUserBuy ? (
                  <div
                    onClick={this.toggleBuyer}
                    className={classNames(
                      'ui left labeled compact icon button',
                      'waves-effect waves-button', {
                      primary: !isUserBuyer
                    })}
                  >
                    <i className="ui dollar icon" />
                    {isUserBuyer ? (
                      <T>I will not buy this</T>
                    ) : (
                      <T>I will buy this</T>
                    )}
                  </div>
                ) : null}
              </div>
          </div>
          <div className="present-details--description">

            <h3 className="ui dividing header">
              {forUsers ? (
                <div className="hint">
                  <T>present</T>
                  <span>&nbsp;</span>
                  <T>for</T>
                  <span>:&nbsp;</span>
                  {forUsers.map(user => (
                    <User
                      key={user._id}
                      user={user} />
                  ))}
                </div>
              ) : null}
              <div className="content">
                <T>Description</T>
              </div>
            </h3>

            <div className="hint">
              <T>added by</T>
              <span>:&nbsp;</span>
              <User user={creator} />
              <span>&nbsp;(</span>
              <DateField
                date={present.createdAt}
                mode="from"
              />
              <span>)</span>
            </div>

            <ParsedText
              text={present.description}
              className="description"
            />

            <div className="chats">

              {canUserBuy ? (
                <Chat
                  loading={!commentsReady}
                  onMessageSubmit={this.sendSecretMessage}
                  comments={commentsSecret}
                  titleEl={(
                    <h3 className="ui dividing header">
                      <i className="comments outline icon" />
                      <div className="content">
                        <T>Chat</T>
                        {forUsers ? (
                          <div className="sub header">
                            <T>Without</T>
                            <span>:&nbsp;</span>
                            <span>
                              {forUsers.map(user => (
                                user.profile.name
                                  .capitalizeFirstLetter()
                              )).join(', ')}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </h3>
                  )}
                />
              ) : null}

              {present.isOwn ? (
                <Chat
                  loading={!commentsReady}
                  onMessageSubmit={this.sendSharedMessage}
                  comments={commentsShared}
                  titleEl={(
                    <h3 className="ui dividing header">
                      <i className="help icon" />
                      <div className="content">
                        {!forUsers || forUsers.length > 1 ? (
                          <T>Questions for beneficiaries</T>
                        ) : (
                          <span>
                            <T>Questions for</T>
                            <span>&nbsp;</span>
                            <span>
                              {forUsers[0].profile.name
                                .capitalizeFirstLetter()}
                            </span>
                          </span>
                        )}
                      </div>
                    </h3>
                  )}
                />
              ) : null}

            </div>

          </div>
        </div>

      </Modal>
    )
  }
}

PresentDetailsModal.propTypes = {
  presentId: PropTypes.string.isRequired
}

PresentDetails = createContainer(({ presentId }) => {
  const currentEvent = Session.get('event')
  const currentUser = Session.get('currentUser')
  const participantIds = Session.get('participantIds')
  const user = Meteor.user()
  const present = Presents.findOne(presentId)
  const isParticipantsModeMulti =
    user && user.settings.viewMode.participantsMode === 'multi'
  const isPresentFromThisEvent = present && currentEvent &&
    currentEvent._id === present.eventId
  const presentEvent = present &&
    Events.findOne(present.eventId)
  const presentReadyToShow = present && (
      isPresentFromThisEvent ||
      Meteor
        .subscribe('eventDetails', { eventId: present.eventId })
        .ready()
    )
  const isManyToOne = presentEvent &&
    presentEvent.type === 'many-to-one'
  const commentsReady = Meteor
    .subscribe('presentDetails', { presentId })
    .ready()
  let forUsers = []
  const presentIds = isManyToOne  ?
    getPresentIds() :
    (participantIds && _.flatten(participantIds.map(getPresentIds)))
  const currentPresentIndex = presentIds &&
    presentIds.indexOf(presentId)

  function getPresentIds(forUserId) {
    const selector = forUserId ? { forUserId } : {}
    return Presents.find(selector, {
      sort: {
        isOwn: -1,
        createdAt: 1
      },
      fields: {
        _id: 1
      }
    }).map(p => p._id)
  }

  function shouldShowArrows() {
    //basically, don't show arrows if present that we want to show
    //is not already in Presents container.
    const isCurrentlyViewingForUser = present && currentUser &&
      currentUser._id === present.forUserId
    return isPresentFromThisEvent &&
      (isManyToOne || isParticipantsModeMulti || isCurrentlyViewingForUser)
  }

  if (isManyToOne) {
    forUsers = Participants.find({
      _id: { $in: presentEvent.beneficiaryIds }
    }).fetch()
  } else if (presentReadyToShow) {
    let forUser = Participants.findOne(present.forUserId)
    forUsers = present && forUser && [forUser]
  }

  if (!isManyToOne &&
      isPresentFromThisEvent &&
      isParticipantsModeMulti &&
      forUsers && forUsers.length > 0) {
    Session.set('currentUser', forUsers[0])
  }

  return {
    present,
    event: presentEvent,
    commentsReady,
    presentReadyToShow,
    forUsers,
    creator: present &&
      Participants.findOne(present.creatorId),
    buyers: present &&
      present.buyers &&
      present.buyers.length !== 0 &&
      Participants.find({
        _id: { $in: present.buyers }
      }).fetch(),
    previousPresentId: shouldShowArrows() &&
      presentIds[currentPresentIndex - 1],
    nextPresentId: shouldShowArrows() &&
      presentIds[currentPresentIndex + 1]
  }
}, PresentDetailsModal)
