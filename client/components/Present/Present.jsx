import React, { Component, PropTypes } from 'react'
import { $ } from 'meteor/jquery'
import { _i18n } from 'meteor/universe:i18n'
import reactMixin from 'react-mixin'
import { classNames } from 'meteor/maxharris9:classnames'
import { Tooltips } from '../../../lib/Mixins'

Present = class Present extends Component {

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
    const { buyers } = this.props.present
    const hasBuyers = buyers && buyers.length
    const users = hasBuyers &&
      Participants.find({ _id: { $in: buyers }}).fetch()
    const usersMessage = users &&
      `${_i18n.__('Buyers')}: ${users.map(u => u.profile.name).join(', ')}`

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
    this.setState({ isActive: true })
  }

  setInactive() {
    this.setState({ isActive: false })
  }

  showPresent() {
    const { present } = this.props

    ModalManager.open(
      <PresentDetails presentId={present._id} />,
      {
        id: 'present-details',
        className: 'inverted',
      }
    )
  }

  render() {
    const {
      present,
      viewMode
    } = this.props
    const isFullWidth = viewMode === 'full-width'
    const hasBuyers = present &&
      present.buyers &&
      present.buyers.length > 0

    if (!present) {
      return null
    }

    return (
      <div
        className={classNames('present', {
          'full-width': isFullWidth
        })}
      >
        <div
          onMouseEnter={this.setActive}
          onMouseLeave={this.setInactive}
          onClick={this.showPresent}
          className={classNames('ui card', {
            active: this.state.isActive
          })}
        >
          <Img
            className="image waves-effect"
            src={present.picture.small}
          />
          <div
            ref="buyers"
            className={classNames('ui left corner olive tiny label', {
              hidden: !hasBuyers
            })}
          >
            <i className="dollar icon" />
          </div>

          {present.isUserCreator() ? (
            <PresentPopup
              present={present}
              buttonClassName="edit-present small-icon-button"
              icon={(
                <i className="vertical ellipsis icon" />
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
          color={present.isOwn ? 'green' : 'red'}
          small={!isFullWidth}
        >
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
  present: PropTypes.object.isRequired,
  viewMode: PropTypes.string,
  onClick: PropTypes.func
}

reactMixin(Present.prototype, Tooltips)
