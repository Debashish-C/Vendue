import React from 'react'

export default function Button({title,bgcolor,color}) {
  return (
    <button className={`pl-4 rounded-md pr-4 p-2 ${color} ${bgcolor}`}>
      {title}
    </button>
  )
}
