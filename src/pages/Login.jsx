import React from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';

export default function Login({setToken}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signIn(e) {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_EXERCISEBUDDY_API_SERVER}/login`, {
      email: email,
      password: password
    }).then(res => {
      console.log("JWT token: ", res.data);
      setToken(res.data);
    }).catch(err => {
      console.log("error: ", err);
    })
  }

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
        <h1>Login</h1>
        <Form onSubmit={signIn}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </Form>
      </div>
    </>
  )
}
