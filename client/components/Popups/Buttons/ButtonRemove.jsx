import React from 'react'

ButtonRemove = ({onClick, icon}) => {
  var removeIcon = icon || 'trash'
  return (
    <button
      type="button"
      className="ui labeled icon red button"
      onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}>
      <i className={`${removeIcon} icon`}></i>
      <T>Delete</T>
    </button>
  )
}