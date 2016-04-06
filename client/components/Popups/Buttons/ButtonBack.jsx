import React from 'react'

ButtonBack = ({onClick}) => (
  <button
    type="button"
    className="ui labeled icon button"
    onClick={onClick}>
    <i className="caret left icon"></i>
    <T>Back</T>
  </button>
)