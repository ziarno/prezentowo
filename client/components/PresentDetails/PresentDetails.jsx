import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'

PresentDetails = class PresentDetails extends React.Component {

  constructor() {
    super()
    this.toggleBuyer = this.toggleBuyer.bind(this)
  }

  toggleBuyer() {
    var {presentId, present} = this.props
    var action = !present.isUserBuyer()

    Presents.methods.setBuyer.call({
      presentId,
      action
    })
  }

  render() {
    var {present, forUser, creator, buyers} = this.props
    var isUserBuyer = present.isUserBuyer()
    var shouldShowBuyButton =
      !(present.isOwn && present.creatorId === Meteor.userId())
    var IWillBuyButton = (
      <div
        onClick={this.toggleBuyer}
        type="button"
        className="ui primary left labeled compact icon button waves-effect waves-button">
        <i className="ui dollar icon" />
        <T>I will buy this</T>
      </div>
    )
    var IWillNotBuyButton = (
      <div
        onClick={this.toggleBuyer}
        type="button"
        className="ui left labeled compact icon button waves-effect waves-button">
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
        <div className="content--top content">
          <div className="content--image">
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
                    users={[forUser]}
                    onRemove={ModalManager.close}
                    popupSettings={{
                      position: 'bottom center',
                      inline: true,
                      target: '.modal .ribbon '
                    }}
                  />
                ) : null}
                {shouldShowBuyButton ? (
                  isUserBuyer ? IWillNotBuyButton : IWillBuyButton
                ) : null}
              </div>
          </div>
          <div className="content--description">
            <h3 className="ui dividing header">
              <T>Description</T>
            </h3>
            <div className="extra-info">
              {forUser? (
                <div>
                  <T>present</T>
                  <span>&nbsp;</span>
                  <T>for</T>
                  <span>:&nbsp;</span>
                  <User user={forUser}></User>
                </div>
              ) : null}
              <div>
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
            </div>
            <p>{present.description}</p>
          </div>
        </div>
        <div className="content--bottom content">
          <Chat title="Chat 1" />
          <Chat title="Chat 2" />
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
  var present = Presents.findOne(presentId)
  var forUser = present && Participants.findOne(present.forUserId)
  var creator = present && Participants.findOne(present.creatorId)
  var buyers = present &&
    present.buyers &&
    present.buyers.length !== 0 &&
    Participants.find({
      _id: {$in: present.buyers}
    }).fetch()

  return {
    present,
    forUser,
    creator,
    buyers
  }
}, PresentDetails)