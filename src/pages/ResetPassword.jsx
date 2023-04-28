import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ButtonGroup, Button, Form, Container } from 'react-bootstrap';
import AuthContext from '../components/AuthProvider';

import { useParams } from 'react-router-dom';

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [formValid, setFormValid] = useState(false);
    const { resetPassword } = React.useContext(AuthContext);

    const { token } = useParams();

    async function handleSubmit(e) {
        e.preventDefault();

        // FIXME: not working
        // if (!formValid) {
        //     return;
        // }
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
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

    function validateForm() {
        let passwordConfirmMatch = password.length > 0 && password === passwordConfirm;
        setFormValid(passwordConfirmMatch);
        console.log(passwordConfirmMatch);
    }



    return (
        <Container>
            <h2>Reset Password</h2>

            <Form noValidate validated={formValid} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" required value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">Reset Password</Button>
            </Form>
        </Container>
    )
}
