import React from 'react'

CountLabel = ({count, className, icon, tooltip}) => (
  <Label
    tooltip={tooltip}
    className={classNames('count-label', className)}>
    <span>
      {count}
    </span>
    <i className={classNames(icon, 'icon')}></i>
  </Label>
)