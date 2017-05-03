import React, { PropTypes } from 'react'

Modal = ({
  ribbon,
  ribbonColor,
  title,
  children
}) => (
  <div className="ui modal">
    <div className="content-wrapper">

      {ribbon ? (
        <Ribbon
          color={ribbonColor}
          withEndings
        >
          <div>
            <h1>{title}</h1>
            <div
              onClick={ModalManager.close}
              className="close-modal ui button small-icon-button">
              <i className="remove icon" />
            </div>
          </div>
        </Ribbon>
      ) : title ? (
        <div className="header">
          {title}
        </div>
      ) : null}

      {children}

    </div>
  </div>
)

Modal.propTypes = {
  title: PropTypes.string,
  ribbon: PropTypes.bool,
  ribbonColor: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}
