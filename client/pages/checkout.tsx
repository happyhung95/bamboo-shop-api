import React from 'react'
import { NextPage } from 'next'
import axios from 'axios'

type Props = {
  data: string[]
}

const CheckOut: NextPage<Props> = ({ data }) => (
  <>
    <div className="font-bold text-2xl text-teal-500 text-center py-3">Your items</div>
    <div className="flex justify-center">
      <div className="pb-2 w-full md:w-3/5">
        <div className="flex px-4 text-teal-600 font-semibold border-b border-teal-600">
          <div className="w-1/2">Name</div>
          <div className="flex justify-end w-1/6">Price</div>
          <div className="flex justify-end w-1/6">Quantity</div>
          <div className="flex justify-end w-1/6">Amount</div>
        </div>
        <div className="flex px-4 text-gray-700 mt-2">
          <div className="w-1/2">
            product.name
            <span className="ml-4 px-1 text-gray-300 border border-white rounded-lg hover:text-red-700 hover:border-red-700 ">
              x
            </span>
          </div>
          <div className="flex justify-end w-1/6">19.90</div>
          <div className="flex justify-end w-1/6">
            <select id="qty" name="qtylist" form="qtyform">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="flex justify-end w-1/6">19.90</div>
        </div>
        <div className="flex px-4 text-gray-700 mt-2">
          <div className="w-1/2">
            product.name
            <span className="ml-4 px-1 text-gray-300 border border-white rounded-lg hover:text-red-700 hover:border-red-700 ">
              x
            </span>
          </div>
          <div className="flex justify-end w-1/6">19.90</div>
          <div className="flex justify-end w-1/6">
            <select id="qty" name="qtylist" form="qtyform">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="flex justify-end w-1/6">19.90</div>
        </div>
        <div className="flex px-4 text-gray-700 mt-2 pt-1">
          <div className="w-2/3" />
          <div className="flex justify-end w-1/6 border-teal-600 border-t">Subtotal</div>
          <div className="flex justify-end w-1/6 border-teal-600 border-t">39.80</div>
        </div>
        <div className="flex px-4 text-gray-700 mt-1">
          <div className="w-2/3" />
          <div className="flex justify-end w-1/6 ">Shipping</div>
          <div className="flex justify-end w-1/6">9.80</div>
        </div>
        <div className="flex px-4 mt-1 text-teal-600 text-lg font-bold ">
          <div className="w-2/3" />
          <div className="flex justify-end w-1/6 ">Total</div>
          <div className="flex justify-end w-1/6">49.60</div>
        </div>
        <div className="flex justify-end m-3">
          <button className="text-teal-600 border-2 border-teal-600 hover:bg-teal-500 hover:text-white font-bold py-2 px-4 rounded">
            Check out
          </button>
        </div>
      </div>
    </div>
  </>
)

// CheckOut.getInitialProps = async () => {
//   const res = await axios.get('http://localhost:3000/api/v1/products')
//   return { data: res.data.data }
// }

export default CheckOut
