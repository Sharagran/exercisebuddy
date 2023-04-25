import React from 'react'

import { Button, Col, Container, Row, Form } from 'react-bootstrap';

export default function RawPoseEditor({ pose, poseIndex, setValue, deleteCurrentPose, editMode }) {
    return (
        <Container fluid>
            <h5>Requirements:</h5>
            <Row className='h6'>
                <Col>
                    <Form.Label>Joint</Form.Label>
                </Col>
                <Col xs={6} className="d-flex justify-content-center">
                    <Form.Label>Required Angle</Form.Label>
                </Col>
                <Col>
                    <Form.Label>Threshold</Form.Label>
                </Col>
            </Row>
            {
                pose.requirements.map((req, index) => {
                    return (
                        <Row key={index}>
                            <Col>
                                <Form.Label>{req.bodyJoint.label}</Form.Label>
                            </Col>
                            <Col>
                                <Form.Range min="0" max="360" disabled={!editMode} value={req.requiredAngle} onChange={(e) => {
                                    setValue(req.bodyJoint.label, 'requiredAngle', e.target.value);
                                }} />
                            </Col>
                            <Col>
                                <Form.Control type="number" min={0} max={360} disabled={!editMode} value={req.requiredAngle} onChange={(e) => {
                                    setValue(req.bodyJoint.label, 'requiredAngle', e.target.value);
                                }} />
                            </Col>
                            <Col>
                                <Form.Control type="number" min={0} max={360} disabled={!editMode} value={req.angleThreshold} onChange={(e) => {
                                    setValue(req.bodyJoint.label, 'angleThreshold', e.target.value);
                                }} />
                            </Col>
                        </Row>
                    )
                })
            }

            {(poseIndex > 0 && editMode) &&
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
