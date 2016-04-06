import React from 'react'

ButtonCancel = ({onClick}) => (
  <button
    type="button"
    className="ui labeled icon button"
    onClick={onClick}>
    <i className="remove icon"></i>
    <T>Cancel</T>
  </button>
)