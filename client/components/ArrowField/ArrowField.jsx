import React from 'react'

ArrowField = ({left, right, rounded, onClick}) => {

  return (
    <div
      className={classNames('arrow-field', {
        'arrow--left': left,
        'arrow--right': right,
        rounded
      })}
      onClick={onClick}>
      <i
        className={classNames(
          'chevron',
          {left, right},
          'icon'
        )}
      />
    </div>
  )
}