import React, { PropTypes } from 'react'
import { classNames } from 'meteor/maxharris9:classnames'

ButtonAccept = ({
  onClick,
  text,
  className,
  isSaving,
  icon = 'checkmark'
}) => (
  <button
    type="submit"
    className={classNames(
      'ui labeled icon primary button',
      className,
      {
        loading: isSaving
      }
    )}
    onClick={onClick}
  >
    <i className={`${icon} icon`} />
    <T>{text}</T>
  </button>
)

ButtonAccept.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  className: PropTypes.string,
  isSaving: PropTypes.string,
  icon: PropTypes.string
}
