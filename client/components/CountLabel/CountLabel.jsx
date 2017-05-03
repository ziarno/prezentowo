import React from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

CountLabel = ({ count, className, icon, tooltip }) => (
  <Label
    tooltip={tooltip}
    className={classNames('count-label', className)}
  >
    <span>{count}</span>
    <i className={classNames(icon, 'icon')} />
  </Label>
)
