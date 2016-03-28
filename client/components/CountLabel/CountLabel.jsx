import React from 'react'

CountLabel = ({count, className, icon}) => (
  <div className={classNames('count-label ui label', className)}>
    <i className={classNames(icon, 'icon')}></i>
    {count}
  </div>
)