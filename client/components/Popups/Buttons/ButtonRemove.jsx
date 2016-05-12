import React from 'react'

ButtonRemove = ({onClick, icon, text}) => {
  var removeIcon = icon || 'trash'
  var displayText = text || 'Delete'
  return (
    <button
      type="button"
      className="ui labeled icon red button"
      onClick={onClick}>
      <i className={`${removeIcon} icon`}></i>
      <T>{displayText}</T>
    </button>
  )
}