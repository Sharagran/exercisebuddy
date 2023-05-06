import React from 'react'
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import Select from 'react-select'

const allBodyJoints = [
    'nose',

    'rightShoulder',
    'rightElbow',

    'leftShoulder',
    'leftElbow',

    'rightHip',
    'rightKnee',

    'leftHip',
    'leftKnee',
];

export default function RawPoseEditor({ pose, poseIndex, setValue, deleteCurrentPose, editMode, deleteRequirement }) {
    var remainingBodyJoints = [];
    function getRemainingBodyJoints() {
        allBodyJoints.forEach(bodyJoint => {
            var exists = false;
            pose.requirements.forEach(req => {
                if (req.bodyJoint.label === bodyJoint) {
                    exists = true;
                }
            });
            if (!exists) {
                remainingBodyJoints.push(bodyJoint);
            }
        });
    }

    getRemainingBodyJoints();

    return (
        <Container fluid>
            <h5>Requirements:</h5>
            {pose.requirements.length > 0 &&
            <Row className='h6'>
                <Col>
                    <Form.Label>Joint</Form.Label>
                </Col>
                <Col xs={5} className="d-flex justify-content-center">
                    <Form.Label>Required Angle</Form.Label>
                </Col>
                <Col>
                    <Form.Label>Threshold</Form.Label>
                </Col>
                <Col className='d-flex justify-content-end'>
                    <Form.Label>Delete</Form.Label>
                </Col>
            </Row>
            }
            {
                pose.requirements.map((req, index) => {
                    return (
                        <Row className='mb-2' key={index}>
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
                            <Col className='d-flex justify-content-end'>
                                <Button variant='danger' disabled={!editMode} onClick={(e) => {
                                    deleteRequirement(req.bodyJoint.label);
                                }}>
                                    <i className="bi bi-trash" />
                                </Button>
                            </Col>
                        </Row>
                    )
                })
            }
            <Row className='mb-2'>
                <Col>
                    {remainingBodyJoints.length > 0 &&
                        <Select placeholder='Add requirement' value={null} isDisabled={!editMode} onChange={(e) => {
                            setValue(e.value, 'requiredAngle', 180);
                            setValue(e.value, 'angleThreshold', 15);
                        }} menuPosition='fixed' options={remainingBodyJoints.map((joint) => {
                            return { value: joint, label: joint };
                        })} />
                    }
                </Col>
            </Row>

            {(poseIndex > 0) &&
                <Row>
                    <Col>
                        <Button disabled={!editMode} variant='danger' onClick={(e) => {
                            deleteCurrentPose();
                        }}>Delete Pose</Button>
                    </Col>
                </Row>
            }
        </Container>
    )
}
