import React from 'react'

Modal = class Modal extends React.Component {

  render() {
    return (
      <div className="ui modal">
        <div className="content-wrapper">

          {this.props.ribbon ? (
            <Ribbon
              color={this.props.ribbonColor}
              withEndings>
              <div>
                <h1>{this.props.title}</h1>
                <div
                  onClick={ModalManager.close}
                  className="close-modal ui button small-icon-button">
                  <i className="remove icon" />
                </div>
              </div>
            </Ribbon>
              ) : (
            <div className="header">
              {this.props.title}
            </div>
          )}

          {this.props.children}

        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  title: React.PropTypes.string.isRequired,
  ribbon: React.PropTypes.bool,
  ribbonColor: React.PropTypes.string
}