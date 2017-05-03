import React, { PropTypes } from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

ArrowField = ({
  left,
  right,
  rounded,
  onClick
}) => (
  <div
    className={classNames('arrow-field', {
      'arrow--left': left,
      'arrow--right': right,
      rounded
    })}
    onClick={onClick}
  >
    <i
      className={classNames(
        'chevron',
        {left, right},
        'icon'
      )}
    />
  </div>
)

ArrowField.propTypes = {
  left: PropTypes.bool,
  right: PropTypes.bool,
  rounded: PropTypes.bool,
  onClick: PropTypes.func
}
