import React from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Accordion from 'react-bootstrap/Accordion';
import { useState } from 'react';

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

// controlId: fügt eine id allen relevanten child elementen hinzu (zB. Label, Input)

export default function Search({ search }) {

    const [Author, setAuthor] = useState("");
    const [Created, setCreated] = useState(new Date(), new Date());

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
                <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Control type="search" placeholder="Enter Title" />
                </Form.Group>

                {/* Advanced search */}
                {/* TODO: datalist statt Select? https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist */}
                <Accordion defaultActiveKey="0">
                    <Accordion.Header>Advanced search options</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formCreated">
                                    <FloatingLabel label="Created At">
                                        <DateRangePicker
                                        onCallback={(start, end) => {
                                            console.log(start.format('YYYY-MM-DDTHH:mm:ss.SSS').toString(), end.format('YYYY-MM-DDTHH:mm:ss.SSS').toString())
                                            setCreated(start.format('YYYY-MM-DDTHH:mm:ss.SSS').toString(), end.format('YYYY-MM-DDTHH:mm:ss.SSS').toString())
                                        }}
                                        initialSettings={{
                                            startDate: Created[0],
                                            endDate: Created[1],
                                            // timePicker: true,
                                            // timePicker24Hour: true,
                                         }}>
                                            <Form.Control type="text" placeholder="Created At" />
                                        </DateRangePicker>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="formUpdated">
                                    <FloatingLabel label="Updated At">
                                    <DateRangePicker
                                        onCallback={(start, end) => {
                                            console.log(start.format('YYYY-MM-DDTHH:mm:ss.SSS').toString(), end.format('YYYY-MM-DDTHH:mm:ss.SSS').toString())
                                            setCreated(start.format('YYYY-MM-DDTHH:mm:ss.SSS').toString(), end.format('YYYY-MM-DDTHH:mm:ss.SSS').toString())
                                        }}
                                        initialSettings={{
                                            startDate: Created[0],
                                            endDate: Created[1],
                                            // timePicker: true,
                                            // timePicker24Hour: true,
                                         }}>
                                            <Form.Control type="text" placeholder="Updated At" />
                                        </DateRangePicker>
                                    </FloatingLabel>
                            </Form.Group>
                            </Col>
                            {/* TODO: difficulty, set, repetition, duration, pause, equipment(string array) */}
                        </Row>
                    </Accordion.Body>
                </Accordion>

                <Button variant="primary" type="submit">Search</Button>
            </Form>
        </div>
    )
}
