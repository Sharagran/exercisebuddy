import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ButtonGroup, Button, Form } from 'react-bootstrap';

import AuthContext from '../AuthProvider';


export default function Login({ setLoginAction }) {
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
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <Form.Text muted>
                        <a href='#' onClick={(e) => {
                            e.preventDefault();
                            setLoginAction('forgotPassword');
                        }}>Forgot Password?</a>
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">Sign in</Button>
            </Form>
            {/* FIXME: debug only */}
            <Button onClick={signOut}>Sign Out</Button>
        </>
    )
}
