import React from 'react'
import {Tooltips} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

Present = class Present extends React.Component {

  constructor() {
    super()
    this.state = {
      isActive: false
    }
    this.setActive = this.setActive.bind(this)
    this.setInactive = this.setInactive.bind(this)
    this.showPresent = this.showPresent.bind(this)
  }

  getTooltips() {
    var {buyers} = this.props.present
    var hasBuyers = buyers && buyers.length
    var users = hasBuyers && Participants.find({_id: {$in: buyers}}).fetch()
    var usersMessage = users && `${_i18n.__('Buyers')}:
      ${users.map(u => u.profile.name).join(', ')}`

    if (!hasBuyers) {
      return {}
    }

    return {
      buyers: {
        position: 'top left',
        content: usersMessage
      }
    }
  }

  setActive() {
    this.setState({isActive: true})
  }

  setInactive() {
    this.setState({isActive: false})
  }

  showPresent() {
    var {present} = this.props

    ModalManager.open(
      <PresentDetails presentId={present._id} />,
      {
        id: 'present-details',
        className: 'inverted',
      }
    )
  }

  render() {
    var {present} = this.props
    var isFullWidth = this.props.viewMode === 'full-width'
    var hasBuyers = present.buyers && present.buyers.length

    return (
      <div
        className={classNames('present', {
          'full-width': isFullWidth
        })}>
        <div
          onMouseEnter={this.setActive}
          onMouseLeave={this.setInactive}
          onClick={this.showPresent}
          className={classNames('ui card', {
            active: this.state.isActive
          })}>
          <Img
            className="image waves-effect"
            src={present.picture.small}
          />
          <div
            ref="buyers"
            className={classNames('ui left corner olive tiny label', {
              hidden: !hasBuyers
            })}>
            <i className="dollar icon" />
          </div>

          {present.isUserCreator() ? (
            <PresentPopup
              present={present}
              buttonClassName="edit-present small-icon-button"
              icon={(
                <i className="vertical ellipsis icon"></i>
              )}
              users={present.forUserId && [Participants.findOne(present.forUserId)]}
              popupSettings={{
                onHide: () => {
                  this.setInactive()
                }
              }}
            />
          ) : null}
        </div>
        <Ribbon
          onMouseEnter={this.setActive}
          onMouseLeave={this.setInactive}
          onClick={this.showPresent}
          rightFlatEnding={isFullWidth}
          withEndings={!isFullWidth}
          className={classNames({
            'waves-effect': isFullWidth
          })}
          wrapperClassName={classNames({
            active: this.state.isActive
          })}
          color={classNames({
            green: present.isOwn,
            red: !present.isOwn
          })}
          small={!isFullWidth}>
          {isFullWidth ? (
            <h1>
              <span>{present.title}</span>
            </h1>
          ) : present.title}
        </Ribbon>
      </div>
    )
  }
}

Present.propTypes = {
  present: React.PropTypes.object.isRequired,
  viewMode: React.PropTypes.string,
  onClick: React.PropTypes.func
}

reactMixin(Present.prototype, Tooltips)
