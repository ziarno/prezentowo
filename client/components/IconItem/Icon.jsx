import React from 'react'

//Note: don't change the directory name to 'Icon' -
//meteor doesn't load it then (wtf?)

Icon = ({main, corner, size}) => {
  return corner ? (
    <i className={`${size} icons`}>
      <i className={`${main} icon`} />
      <i className={`corner ${corner} icon`} />
    </i>
  ) : (
    <i className={`${size} ${main} icon`} />
  )
}
