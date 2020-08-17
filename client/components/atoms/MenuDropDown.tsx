import React, { useRef, useEffect } from 'react'
import Link from 'next/link'

type Props = {
  setMenu: (value: React.SetStateAction<boolean>) => void
}

export const MenuDropDown: React.FC<Props> = ({ setMenu }) => {
  const node = useRef<HTMLDivElement>(null) // to detect outside click

  const outsideClickHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!!node && node.current.contains(event.target)) {
      // inside click
      return
    }
    // outside click
    setMenu(false)
  }

  const closeMenu = () => setMenu(false)

  useEffect(() => {
    // add event when Menu dropdown is mounted
    document.addEventListener('click', outsideClickHandler)
    // return function to be called when unmounted
    return () => {
      // remove event listener after component unmount
      document.removeEventListener('click', outsideClickHandler)
    }
  }, [])

  return (
    <div ref={node} className="w-screen flex justify-center border-t border-teal-400  mt-1">
      <div className="w-2/3 lg:w-1/3 px-2 pt-2 flex justify-between text-sm ">
        <Link href="signin">
          <a className="text-teal-200 hover:text-white mr-4" onClick={closeMenu}>
            Category
          </a>
        </Link>
        <Link href="signin">
          <a className="text-teal-200 hover:text-white mr-4" onClick={closeMenu}>
            Bedroom
          </a>
        </Link>
        <Link href="signin">
          <a className="text-teal-200 hover:text-white mr-4" onClick={closeMenu}>
            Contact Us
          </a>
        </Link>
      </div>
    </div>
  )
}
