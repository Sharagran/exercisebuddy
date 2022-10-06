import React from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function signIn(e) {
    e.preventDefault();

    console.log("sign in");
    console.log(username, password);
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
          <Form.Group className="mb-3" controlId="formLogin">
            <Form.Label>Login</Form.Label>
            <Form.Control type="email" placeholder="Enter Login" value={username} onChange={e => setUsername(e.target.value)} />
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
