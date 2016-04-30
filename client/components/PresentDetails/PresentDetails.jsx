import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'

PresentDetails = class PresentDetails extends React.Component {

  constructor() {
    super()
    this.toggleBuyer = this.toggleBuyer.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendSecretMessage = this.sendSecretMessage.bind(this)
    this.sendSharedMessage = this.sendSharedMessage.bind(this)
  }

  toggleBuyer() {
    var {presentId, present} = this.props
    var action = !present.isUserBuyer()

    Presents.methods.setBuyer.call({
      presentId,
      action
    })
  }

  sendMessage({message, type}) {
    var {presentId} = this.props

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

  componentWillReceiveProps({present}) {
    //refresh modal only if the change
    //didn't happen in comments
    var oldPresent = _.omit(this.props.present, ['commentsShared', 'commentsSecret'])
    var newPresent = _.omit(present, ['commentsShared', 'commentsSecret'])

    if (!_.isEqual(oldPresent, newPresent)) {
      ModalManager.refresh()
    }
  }

  render() {
    var {
      event,
      present,
      forUsers,
      creator,
      buyers,
      commentsReady
      } = this.props
    var isUserBuyer = present.isUserBuyer()
    var isUserBeneficiary =
      _.contains(event.beneficiaryIds, Meteor.userId())
    var isUserCreator = present.creatorId === Meteor.userId()
    var canUserBuy =
      !(present.isOwn && isUserCreator) && !isUserBeneficiary
    var commentsShared = present.commentsShared &&
      Comments.find({
        _id: {$in: present.commentsShared}
      }, {sort: {createdAt: 1}}).fetch()
    var commentsSecret = present.commentsSecret &&
      Comments.find({
        _id: {$in: present.commentsSecret}
      }, {sort: {createdAt: 1}}).fetch()
    var IWillBuyButton = (
      <div
        onClick={this.toggleBuyer}
        className="ui primary left labeled compact
          icon button waves-effect waves-button">
        <i className="ui dollar icon" />
        <T>I will buy this</T>
      </div>
    )
    var IWillNotBuyButton = (
      <div
        onClick={this.toggleBuyer}
        className="ui left labeled compact
          icon button waves-effect waves-button">
        <i className="ui dollar icon" />
        <T>I will not buy this</T>
      </div>
    )
    var BuyersMessage = (
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
        title={present.title}>
        <Message
          hidden={!buyers}
          className="top-message small olive icon"
          icon="dollar"
          messageEl={BuyersMessage}
        />
        <div className="present-details--content">
          <div className="present-details--image">
            <Img
              className="waves-effect"
              src={present.pictureUrl} />
              <div className="present-details--buttons">
                {present.isUserCreator() ? (
                  <PresentPopup
                    present={present}
                    icon={<i className="ui vertical ellipsis icon" />}
                    wrapperClassName="edit-present"
                    buttonClassName="left labeled compact"
                    buttonText="Edit present"
                    users={!forUsers || forUsers.length > 1 ?
                      [] : [forUsers[0]]}
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
                  isUserBuyer ? IWillNotBuyButton : IWillBuyButton
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
              <User user={creator}></User>
              <span>&nbsp;(</span>
              <DateField
                date={present.createdAt}
                mode="from">
              </DateField>
              <span>)</span>
            </div>

            <p>{present.description}</p>

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
                                user.profile.name.capitalizeFirstLetter()
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
                              {forUsers[0].profile.name.capitalizeFirstLetter()}
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

PresentDetails.propTypes = {
  //note: cannot pass a present object directly, because modals are outside of the react root, and changes to props don't get propagated
  presentId: React.PropTypes.string.isRequired,

  present: React.PropTypes.object.isRequired
}

PresentDetails = createContainer(({presentId}) => {
  var event = Session.get('event')
  var isManyToOne = event.type === 'many-to-one'
  var query = Presents.find(presentId)
  var commentsReady = Meteor
    .subscribe('comments', {presentId})
    .ready()
  var present
  var forUsers
  var creator
  var buyers

  //note: this listener stops itself when
  //the reactive context stops existing
  query.observeChanges({
    removed() {
      //destroy, to immediately stop this component
      //from rendering an unexisting present
      ModalManager.close()
      ModalManager.destroy()
    }
  })
  present = query.fetch()[0]
  if (isManyToOne) {
    forUsers = Participants.find({
      _id: {$in: event.beneficiaryIds}
    }).fetch()
  } else {
    forUsers = present && [Participants.findOne(present.forUserId)]
  }
  creator = present && Participants.findOne(present.creatorId)
  buyers = present &&
    present.buyers &&
    present.buyers.length !== 0 &&
    Participants.find({
      _id: {$in: present.buyers}
    }).fetch()

  return {
    event,
    commentsReady,
    present,
    forUsers,
    creator,
    buyers
  }
}, PresentDetails)