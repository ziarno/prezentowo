import React, { PropTypes } from 'react'

ButtonCancel = ({ onClick }) => (
  <button
    type="button"
    className="ui labeled icon button"
    onClick={onClick}
  >
    <i className="remove icon" />
    <T>Cancel</T>
  </button>
)

ButtonCancel.propTypes = {
  onClick: PropTypes.func
}
