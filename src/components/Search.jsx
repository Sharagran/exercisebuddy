import React from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Accordion from 'react-bootstrap/Accordion';
import { useState } from 'react';

import DatePicker from './DateRangePickerWrapper';

// controlId: fügt eine id allen relevanten child elementen hinzu (zB. Label, Input)

export default function Search({ search }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [createdAt, setCreatedAt] = useState(new Date(), new Date());
    const [updatedAt, setUpdatedAt] = useState(new Date(), new Date());

    const [difficulty, setDifficulty] = useState(0);
    const [set, setSet] = useState(0);
    const [repetition, setRepetition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [pause, setPause] = useState(0);

    const [diagnoses, setDiagnoses] = useState([]);
    const [equipment, SetEquipment] = useState([]);

    function submit(e) {
        e.preventDefault();

        search({
            title,
            description,

            createdAt,
            updatedAt,

            difficulty,
            set,
            repetition,
            duration,
            pause,

            diagnoses,
            equipment
        });
    }

    return (
        <div className='search'>
            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <FloatingLabel label="Title">
                        <Form.Control type="search" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                    </FloatingLabel>
                </Form.Group>

                {/* Advanced search */}
                {/* TODO: datalist statt Select? https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist */}
                <Accordion defaultActiveKey="0">
                    <Accordion.Header>Advanced search options</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDescription">
                                    <FloatingLabel label="Description">
                                        <Form.Control type="search" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formCreated">
                                    <FloatingLabel label="Created At">
                                        <DatePicker
                                            initalStartDate={createdAt[0]}
                                            initalEndDate={createdAt[1]}
                                            refDate={setCreatedAt}
                                            includeTime={true}
                                        >
                                            <Form.Control type="text" placeholder="Created At" />
                                        </DatePicker>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formUpdated">
                                    <FloatingLabel label="Updated At">
                                        <DatePicker
                                            initalStartDate={updatedAt[0]}
                                            initalEndDate={updatedAt[1]}
                                            refDate={setUpdatedAt}
                                            includeTime={true}
                                        >
                                            <Form.Control type="text" placeholder="Updated At" />
                                        </DatePicker>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* TODO: limit number ranges */}
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDifficulty">
                                    <FloatingLabel label="Difficulty">
                                        <Form.Control type="number" placeholder="Difficulty" onChange={(e) => setDifficulty(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formSet">
                                    <FloatingLabel label="Set">
                                        <Form.Control type="number" placeholder="Set" onChange={(e) => setSet(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formRepetition">
                                    <FloatingLabel label="Repetition">
                                        <Form.Control type="number" placeholder="Repetition" onChange={(e) => setRepetition(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDuration">
                                    <FloatingLabel label="Duration">
                                        <Form.Control type="number" placeholder="Duration" onChange={(e) => setDuration(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formPause">
                                    <FloatingLabel label="Pause">
                                        <Form.Control type="number" placeholder="Pause" onChange={(e) => setPause(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Find a system to add multiple items to array (tag list from CloudNein?) */}
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDiagnoses">
                                    <FloatingLabel label="Diagnoses">
                                        <Form.Control type="text" placeholder="Diagnoses" onChange={(e) => setDiagnoses(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formEquipment">
                                    <FloatingLabel label="Equipment">
                                        <Form.Control type="text" placeholder="Equipment" onChange={(e) => SetEquipment(e.target.value)} />
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
