import React from 'react'

Modal = class Modal extends React.Component {

  render() {
    return (
      <div className="ui modal">

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
    )
  }

}

Modal.propTypes = {
  title: React.PropTypes.string.isRequired,
  ribbon: React.PropTypes.bool,
  ribbonColor: React.PropTypes.string
}