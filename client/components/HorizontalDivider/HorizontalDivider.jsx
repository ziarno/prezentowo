import React from 'react'

HorizontalDivider = ({children}) => (
  <div className="horizontal-divider">
    <div className="horizontal-divider--line"></div>
    <div className="horizontal-divider--content">
      {children}
    </div>
    <div className="horizontal-divider--line"></div>
  </div>
)