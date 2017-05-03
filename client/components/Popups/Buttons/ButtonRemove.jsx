import React, { PropTypes } from 'react'

ButtonRemove = ({
  onClick,
  icon = 'trash',
  text = 'Delete'
}) => (
  <button
    type="button"
    className="ui labeled icon red button"
    onClick={onClick}
  >
    <i className={`${icon} icon`} />
    <T>{text}</T>
  </button>
)

ButtonRemove.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  text: PropTypes.string
}
