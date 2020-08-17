import React, { useState } from 'react'

import HeartIconBorder from '@material-ui/icons/FavoriteBorder'
import HeartIconFilled from '@material-ui/icons/Favorite'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

type Props = {
  product: any
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const [isHovered, setHover] = useState(false)
  const [isActive, setActive] = useState(false)

  return (
    <div className="flex justify-center">
      <div className="max-w-sm m-3 rounded overflow-hidden shadow-lg">
        <img className="w-full" src="https://picsum.photos/id/100/400" alt="Sunset in the mountains" />
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="font-bold text-xl py-2">
              product.name
              <span className="px-1" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                {isActive ? (
                  <HeartIconFilled className="text-gray-700 font-semibold" onClick={() => setActive(false)} />
                ) : isHovered ? (
                  <HeartIconFilled className="text-gray-700 font-semibold" onClick={() => setActive(true)} />
                ) : (
                  <HeartIconBorder className="text-gray-700 font-semibold" />
                )}
              </span>
            </div>
            <div className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-teal-500 hover:text-white">
              <span className="pr-1">
                <ShoppingCartIcon />
              </span>
              Add to cart
            </div>
          </div>
          <div className="mt-2 text-gray-700 text-base">
            Price:
            <span className="px-3 py-1 text-sm font-semibold text-gray-700 mr-2">product.price</span>
          </div>
          <div className="mt-2 text-gray-700 text-base">
            Manufacturer:
            <span className="px-3 py-1 text-sm font-semibold text-gray-700 mr-2">product.manufacturer</span>
          </div>
          <div className="text-gray-700 text-base">
            Sizes:
            {['S', 'M', 'L'].map((size) => (
              <span className="inline-block bg-gray-200 rounded px-3 py-1 text-sm font-semibold text-gray-700 mt-2 ml-1 mr-1 hover:bg-gray-500 hover:text-white">
                {size}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4 px-6">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 hover:bg-gray-500 hover:text-white">
            #product.category
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 hover:bg-gray-500 hover:text-white">
            #product.category
          </span>
        </div>
      </div>
    </div>
  )
}
