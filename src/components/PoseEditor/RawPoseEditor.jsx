import React from 'react'

import { Button, Col, Container, Row, Form } from 'react-bootstrap';

export default function RawPoseEditor({ pose, poseIndex, setValue, deleteCurrentPose }) {
    return (
        <Container fluid>
            {
                pose.requirements.map((req, index) => {
                    return (
                        <Row key={index}>
                            <Col>
                                <Form.Label>{req.bodyJoint.label}</Form.Label>
                            </Col>
                            <Col>
                                <Form.Range min="0" max="360" value={req.requiredAngle} onChange={(e) => {
                                    setValue(req.bodyJoint.label, e.target.value);
                                }} />
                            </Col>
                            <Col>
                                <Form.Control type="number" min={0} max={360} value={req.requiredAngle} onChange={(e) => {
                                    setValue(req.bodyJoint.label, e.target.value);
                                }} />
                            </Col>
                        </Row>
                    )
                })
            }

            {poseIndex > 0 &&
                <Row>
                    <Col>
                        <Button variant='danger' onClick={(e) => {
                            deleteCurrentPose();
                        }}>Delete Pose</Button>
                    </Col>
                </Row>
            }
        </Container>
    )
}
