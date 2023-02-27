import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ButtonGroup, Button, Form } from 'react-bootstrap';
import axios from 'axios';

import { useParams } from 'react-router-dom';

export default function ResetPassword() {

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [formValid, setFormValid] = useState(false);

    const { token } = useParams();
    console.log(token);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formValid) {
            return;
        }
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        const result = await axios.post('/passwords/change', {
            token: token,
            password: password,
        });

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
        <div>
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
        </div>
    )
}
