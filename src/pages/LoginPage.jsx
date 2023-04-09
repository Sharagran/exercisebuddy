import React, { useState } from 'react'

import Login from '../components/Login/Login';
import ForgotPassword from '../components/Login/ForgotPassword';
import { Container } from 'react-bootstrap';


export default function LoginPage() {
  const [loginAction, setLoginAction] = useState('login');
  return (
    <Container className='d-flex justify-content-center'>
      <div style={{
        minWidth: '200px',
        maxWidth: '400px',
        marginTop: '50px',
        padding: '80px',
        border: '1px solid #ccc',
        backgroundColor: '#eee'
      }}>
        <h1>Exercisebuddy</h1>
        {
          loginAction === 'login' ? <Login setLoginAction={setLoginAction} /> : <ForgotPassword setLoginAction={setLoginAction} />
        }
      </div>
    </Container>
  )
}
