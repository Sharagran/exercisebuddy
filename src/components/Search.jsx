import React from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Accordion from 'react-bootstrap/Accordion';

// controlId: fügt eine id allen relevanten child elementen hinzu (zB. Label, Input)

export default function Search() {
    return (
        <div className='search'>
            <h3>Search</h3>
            <Form>
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
                                        <Form.Select>
                                            <option>Select an author</option>
                                            <option value="1">author 0</option>
                                            <option value="2">author 1</option>
                                            <option value="3">author 2</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formCreated">
                                    <FloatingLabel label="Creation date">
                                        <Form.Control type="date" placeholder="Created" />
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
