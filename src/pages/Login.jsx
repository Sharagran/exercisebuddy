import React from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import AuthContext from '../components/AuthProvider';


export default function Login() {
  const { token, signIn, signOut } = React.useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  async function handleSubmit(e) {
    e.preventDefault();

    const result = await signIn(email, password);

    if (result.status >= 200 && result.status < 300) {
      console.log("Successfully logged in!");
      toast.success("Successfully logged in!");

      // TODO: comment
      window.location.reload();
    } else if (result.status === 401) {
      toast.error("Username or password incorrect!");
      console.log(result.statusText);
    } else {
      toast.error("Something went wrong!");
      console.error(result.statusText);
    }
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
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">Sign in</Button>
        </Form>
        {/* FIXME: debug only */}
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    </>
  )
}
