import React from 'react'
import { NextPage } from 'next'
import axios from 'axios'
import { ProductCard } from '../components/molecules'

type Props = {
  data: string[]
}

const Index: NextPage<Props> = ({ data }) => (
  <>
    <ProductCard product={data} />
    {/* {data.map((product: any) => (
      <ProductCard product={product} />
    ))} */}
  </>
)

// Index.getInitialProps = async () => {
//   const res = await axios.get('http://localhost:3000/api/v1/products')
//   return { data: res.data.data }
// }

export default Index
