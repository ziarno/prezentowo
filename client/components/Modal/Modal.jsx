import React from 'react'

Modal = class Modal extends React.Component {

  componentDidUpdate() {
    ModalManager.refresh()
  }

  render() {
    return (
      <div className="ui modal">
        <div className="content-wrapper">

          {this.props.ribbon ? (
            <Ribbon
              color={this.props.ribbonColor}
              withEndings>
              <h1>{this.props.title}</h1>
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