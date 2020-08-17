import React, { useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

type Props = {
  data: string[]
}

const Register: NextPage<Props> = () => {
  return (
    <div className="flex justify-center py-4 bg-gray-100">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              First Name
              <input
                className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
              <input
                className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
              <input
                className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
              />
            </label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
              <input
                className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
              />
            </label>
          </div>
          <div>
            <button
              className="border-solid border-2 border-teal-500 hover:bg-teal-500 text-teal-500 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Register
            </button>
            <Link href="signin">
              <a className="mt-4 block align-baseline font-semi-bold text-sm text-gray-500 hover:text-teal-500">
                Already have an account?
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
