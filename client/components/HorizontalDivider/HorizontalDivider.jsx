import React, { PropTypes } from 'react'

HorizontalDivider = ({ children }) => (
  <div className="horizontal-divider">
    <div className="horizontal-divider--line"></div>
    <div className="horizontal-divider--content">
      {children}
    </div>
    <div className="horizontal-divider--line"></div>
  </div>
)

HorizontalDivider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}
