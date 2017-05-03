import React, { PropTypes } from 'react'

ButtonBack = ({ onClick }) => (
  <button
    type="button"
    className="ui labeled icon button"
    onClick={onClick}
  >
    <i className="caret left icon" />
    <T>Back</T>
  </button>
)

ButtonBack.propTypes = {
  onClick: PropTypes.func
}
