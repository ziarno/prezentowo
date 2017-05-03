import React, { Component, PropTypes } from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

Message = class Message extends React.Component {

  constructor() {
    super()
    this.state = {
      hidden: false
    }
  }

  close() {
    this.setState({
      hidden: true
    })
  }

  render() {
    const {
      className,
      closable,
      title,
      icon,
      message,
      messageEl,
      messages
    } = this.props
    let messageView = null

    if (message) {
      messageView = <span>{message}</span>
    } else if (messageEl) {
      messageView = messageEl
    } else if (messages && messages.length) {
      let key = 0
      messageView = (
        <ul className="list">
          {messages.map((message) => (
            <li key={key++}>{message}</li>
          ))}
        </ul>
      )
    }

    return (
      <div
        className={classNames('ui message', className, {
          hidden: this.state.hidden || this.props.hidden
        })}
      >

        {closable ? (
          <i className="close icon"
             onClick={this.close}>
          </i>
        ) : null}

        {title ? (
          <div className="header">
            {title}
          </div>
        ) : null}

        {icon ? (
          <i className={classNames(icon, 'icon')}/>
        ) : null}

        {messageView}
      </div>
    )
  }
}

Message.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  closable: PropTypes.bool,
  hidden: PropTypes.bool,
  message: PropTypes.string,
  messageEl: PropTypes.element,
  messages: PropTypes.array
}
