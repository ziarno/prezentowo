import React from 'react'

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

  setActive() {
    this.setState({isActive: true})
  }

  setInactive() {
    this.setState({isActive: false})
  }

  showPresent() {
    var {present} = this.props

    ModalManager.open(
      <PresentDetails present={present} />,
      {
        className: 'present-details'
      }
    )
  }

  render() {
    var isFullWidth = this.props.viewMode === 'full-width'
    var {present} = this.props

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
            src={present.pictureUrl}
          />

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