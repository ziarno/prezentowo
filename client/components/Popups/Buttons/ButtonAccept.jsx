import React from 'react'

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
    onClick={onClick}>
    <i className={`${icon} icon`}></i>
    <T>{text}</T>
  </button>
)