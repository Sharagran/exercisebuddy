import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ButtonGroup, Button, Form, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';

export default function ForgotPassword({ setLoginAction }) {
    const [email, setEmail] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const result = await axios.post('/passwords/forgot', {
            email: email
        });

        if (result.status >= 200 && result.status < 300) {
            console.log("Successfully sent email!");
            toast.success("Successfully sent email!");
        } else {
            toast.error("Something went wrong!");
            console.error(result.statusText);
        }

        
    }
    return (
        <div>
            <h2>Forgot Password</h2>
            <a href='#' onClick={(e) => {
                e.preventDefault();
                setLoginAction('login');
            }}>Back to Login</a>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">Reset Password</Button>
            </Form>
        </div>
    )
}
