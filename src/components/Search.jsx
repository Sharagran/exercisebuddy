import React from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Accordion from 'react-bootstrap/Accordion';
import { useState } from 'react';

// controlId: fügt eine id allen relevanten child elementen hinzu (zB. Label, Input)

export default function Search({search}) {

    const [Author, setAuthor] = useState("");
    const [Created, setCreated] = useState("");

    function submit(e) {
        e.preventDefault();

        search({
            author: Author,
            created: Created,
        });
    }

    return (
        <div className='search'>
            <h3>Search</h3>
            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="search" placeholder="Enter Name" />
                </Form.Group>

                {/* Advanced search */}
                {/* TODO: datalist statt Select? https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist */}
                <Accordion defaultActiveKey="0">
                    <Accordion.Header>Advanced search options</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formAuthor">
                                    <FloatingLabel label="Author">
                                        <Form.Select onChange={e => setAuthor(e.target.value)}>
                                            <option value="">Select an author</option>
                                            <option value="0">author 0</option>
                                            <option value="1">author 1</option>
                                            <option value="2">author 2</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formCreated">
                                    <FloatingLabel label="Creation date">
                                        <Form.Control type="date" placeholder="Created" onChange={e => setCreated(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion>

                <Button variant="primary" type="submit">Search</Button>
            </Form>
        </div>
    )
}
