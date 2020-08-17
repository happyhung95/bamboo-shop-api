import React from 'react'
import { NextPage } from 'next'
import axios from 'axios'

type Props = {
  data: string[]
}

const Profile: NextPage<Props> = ({ data }) => {
  return (
    <div>
      <div>profile</div>
    </div>
  )
}

// Profile.getInitialProps = async () => {
//   const res = await axios.get('http://localhost:3000/api/v1/products')
//   return { data: res.data.data }
// }

export default Profile
