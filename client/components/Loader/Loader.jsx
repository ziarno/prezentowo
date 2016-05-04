import React from 'react'

Loader = ({visible, size, text, inverted}) => (
  <div
    className={classNames('ui dimmer', {
      inverted,
      active: _.isBoolean(visible) ? visible : true
    })}>
    <div className={classNames('ui loader', size, {
      text: !!text
    })}>
      {text || null}
    </div>
  </div>
)