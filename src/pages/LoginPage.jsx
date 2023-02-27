import React, { useState } from 'react'

import Login from '../components/Login/Login';
import ForgotPassword from '../components/Login/ForgotPassword';


export default function LoginPage() {
  const [loginAction, setLoginAction] = useState('login');
  return (
    <>
      <div className='center' style={{
        minWidth: '200px',
        maxWidth: '400px',
        marginTop: '50px',
        padding: '80px',
        border: '1px solid #ccc',
        backgroundColor: '#eee'
      }}>
        {
          loginAction === 'login' ? <Login setLoginAction={setLoginAction} /> : <ForgotPassword setLoginAction={setLoginAction} />
        }
      </div>
    </>
  )
}
