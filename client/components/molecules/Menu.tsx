import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BambooLogo, ShoppingCartIcon, MenuDropDown } from '../atoms'
import { Avatar } from '@material-ui/core'

export const Menu: React.FC = () => {
  const [isMenuOpened, setMenu] = useState(false)
  const [isSignedIn, setProfile] = useState(false)
  const toggleMenu = () => setMenu(!isMenuOpened)

  useEffect(() => {
    //TODO: set profile
  }, [])

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 px-4 py-3">
      <div className="flex items-center">
        <div className="mr-3" onClick={toggleMenu}>
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              {isMenuOpened ? (
                <path d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              )}
            </svg>
          </button>
        </div>
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link href="/">
            <a className="flex items-center font-semibold text-xl tracking-tight">
              <div className="w-12 mr-2">
                <BambooLogo />
              </div>
              <div>Bamboo Shop</div>
            </a>
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <Link className="block" href="checkout">
          <a>
            <ShoppingCartIcon />
          </a>
        </Link>
        <div>
          <Link href="signin">
            <a>
              {isSignedIn ? (
                <Link href="profile">
                  <a className="w-10 h-10 ml-2 bg-gray-200 px-4 py-2 text-teal-500 border rounded-lg hover:bg-white">
                    H
                  </a>
                </Link>
              ) : (
                <span
                  className="inline-block text-sm mx-1 p-1 border rounded-lg border-transparent leading-none text-white hover:border-transparent hover:text-teal-500 hover:bg-white"
                  onClick={() => setProfile(true)}
                >
                  Sign in
                </span>
              )}
            </a>
          </Link>
        </div>
      </div>
      {isMenuOpened && <MenuDropDown setMenu={setMenu} />}
    </nav>
  )
}
