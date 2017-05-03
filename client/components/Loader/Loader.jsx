import React, { PropTypes } from 'react'
import _ from 'underscore'
import { classNames } from 'meteor/maxharris9:classnames'

Loader = ({ visible, size, text, inverted }) => (
  <div
    className={classNames('ui dimmer', {
      inverted,
      active: _.isBoolean(visible) ? visible : true
    })}
  >
    <div
      className={classNames('ui loader', size, {
        text: !!text
      })}
    >
      {text || null}
    </div>
  </div>
)

Loader.propTypes = {
  visible: PropTypes.bool,
  size: PropTypes.string,
  text: PropTypes.string,
  inverted: PropTypes.bool,
}
