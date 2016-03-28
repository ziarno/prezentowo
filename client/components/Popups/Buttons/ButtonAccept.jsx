import React from 'react'

ButtonAccept = ({onClick, text, className}) => (
  <button
    type="submit"
    className={classNames('ui labeled icon primary button', className)}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}>
    <i className="checkmark icon"></i>
    <T>{text}</T>
  </button>
)