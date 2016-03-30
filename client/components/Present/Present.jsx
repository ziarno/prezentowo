import React from 'react'

Present = class Present extends React.Component {
  
  render() {
    return (
      <div className="present ui card">
        <Img
          className="image"
          src={this.props.present.pictureUrl}
        />
        <Ribbon
          color={this.props.present.isOwn() ? 'green' : 'red'}
          small>
          {this.props.present.title}
        </Ribbon>

        {this.props.present.isUserCreator() ? (
          <PresentPopup
            present={this.props.present}
            buttonClassName="edit-present small-icon-button"
            icon={(
              <i className="vertical ellipsis icon"></i>
            )}
            users={Session.get('participants')}
          />
        ) : <div></div> /*empty div because semantic has strong css rules for last element in a card for border-radius */}
      </div>
    )
  }
  
}

Present.propTypes = {
  present: React.PropTypes.object.isRequired
}