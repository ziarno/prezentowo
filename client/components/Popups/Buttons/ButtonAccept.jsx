import React from 'react'

ButtonAccept = ({onClick, text, className, isSaving}) => (
  <button
    type="submit"
    className={classNames(
      'ui labeled icon primary button',
      className,
      {
        loading: isSaving
      }
    )}
    onClick={onClick}>
    <i className="checkmark icon"></i>
    <T>{text}</T>
  </button>
)