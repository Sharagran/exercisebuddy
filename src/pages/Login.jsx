import React from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import AuthContext from '../components/AuthProvider';


export default function Login() {
  const Auth = React.useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  function signIn(e) {
    e.preventDefault();
    // TODO: return more than true or false (e.g. error message or error code)
    const successful = Auth.signIn(email, password);
    if (successful) {
      toast.success("Successfully logged in!");
      navigate("/");
    } else {
      toast.error("Username or password incorrect!");
      //     if (err.response.status === 401) {
      //       toast.error("Username or password incorrect!");
      //     } else {
      //       toast.error("An error occured!");
      //       console.error(err);
      //     }
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
