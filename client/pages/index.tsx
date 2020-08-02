import React from 'react'
import { NextPage } from 'next'
import axios from 'axios'

type Props = {
  data: string[]
}

const Index: NextPage<Props> = ({ data }) => (
  <>
    {data.map((product: any) => (
      <div>{product.name}</div>
    ))}
  </>
)

Index.getInitialProps = async () => {
  const res = await axios.get('http://localhost:3001/api/v1/products')
  return { data: res.data.data }
}

export default Index
