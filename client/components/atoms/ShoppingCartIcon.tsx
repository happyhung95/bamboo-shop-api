import React, { useState } from 'react'
import ShoppingCart from '@material-ui/icons/ShoppingCart'


export function ShoppingCartIcon() {
  const [isHovered, setHover] = useState(false)
  const toggleHover = () => setHover(!isHovered)

  return (
    <button
      className="flex items-center pl-2 pr-6 py-1 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <div className="w-5 flex items-center">
        <ShoppingCart style={{ width: '100%' }} />
        {isHovered ? (
          <span className="mr-1 text-xs font-semibold bg-white text-teal-500 rounded p-1">2</span>
        ) : (
          <span className="mr-1 text-xs font-semibold bg-white bg-opacity-75 text-teal-500 rounded p-1">2</span>
        )}
      </div>
    </button>
  )
}
