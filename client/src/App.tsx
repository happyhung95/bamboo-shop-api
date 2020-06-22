import React from 'react'
import logo from './logo.svg'
import './App.css'
import GoogleLogin from 'react-google-login'
import {GOOGLE_CLIENT_ID} from './secrets'

function App() {
  const responseGoogle = (res:any) => {
    console.log(res.tokenId)
  }
  return (
    <div className="App">
      <header className="App-header">
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      </header>
    </div>
  )
}

export default App
