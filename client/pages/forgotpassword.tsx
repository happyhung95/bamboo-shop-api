import React from 'react'
import Link from 'next/link'
import { NextPage } from 'next'

type Props = {
  data: string[]
}

const ForgotPassword: NextPage<Props> = () => {
  return (
    <div className="flex justify-center py-4 bg-gray-100">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="block mb-4 text-xl text-teal-500 font-bold">Reset Password</div>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Email"
            id="email"
          />
          <div>
            <button
              className="border-solid border-2 border-teal-500 hover:bg-teal-500 text-teal-500 hover:text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Send
            </button>
            <div className="flex items-center mt-4">
              <Link href="signin">
                <a className="align-baseline font-semi-bold text-sm text-gray-500 hover:text-teal-500">Sign in</a>
              </Link>
              <span className="mx-2 font-bold text-sm text-teal-500 ">or</span>
              <Link href="register">
                <a className="align-baseline font-semi-bold text-sm text-gray-500 hover:text-teal-500">Register</a>
              </Link>
              <span className="font-bold text-sm text-teal-500 "> ? </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
