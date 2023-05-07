import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ButtonGroup, Button, Form, Container } from 'react-bootstrap';
import AuthContext from '../components/AuthProvider';

import { useParams } from 'react-router-dom';

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { resetPassword } = React.useContext(AuthContext);

    const { token } = useParams();


    async function handleSubmit(e) {
        e.preventDefault();

        if(password !== passwordConfirm) {
            toast.error("Passwords do not match!");
            console.error("Passwords do not match!");
            return;
        }

        const result = await resetPassword(token, password);

        if (result.status >= 200 && result.status < 300) {
            console.log("Successfully reset password!");
            toast.success("Successfully reset password!");
        } else {
            toast.error("Something went wrong!");
            console.error(result.statusText);
        }
    }


    return (
        <Container>
            <h2>Reset Password</h2>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        isInvalid={password.length > 0 && password !== passwordConfirm}
                        isValid={password.length > 0 && password === passwordConfirm}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        isInvalid={password.length > 0 && password !== passwordConfirm}
                        isValid={password.length > 0 && password === passwordConfirm}
                    />
                    <Form.Control.Feedback type="invalid">
                        Passwords do not match!
                    </Form.Control.Feedback>
                </Form.Group>
                <Button disabled={password.length === 0 || password !== passwordConfirm} variant="primary" type="submit">Reset Password</Button>
            </Form>
        </Container>
    )
}
