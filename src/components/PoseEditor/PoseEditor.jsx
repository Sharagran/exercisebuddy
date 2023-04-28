import React, { Suspense, useEffect, useState } from "react";
import { Row, Col, Container, Pagination } from 'react-bootstrap';

import { Canvas } from "@react-three/fiber";
import { Perf } from 'r3f-perf'

import Model from "./Model";
import RawPoseEditor from "./RawPoseEditor";

const editorHeight = "512px";
export default function PoseEditor({ poses, editMode }) {
    const [poseIndex, setPoseIndex] = useState(0);
    const [currentPose, setCurrentPose] = useState(poses[poseIndex]);

    useEffect(() => {
        setCurrentPose(poses[poseIndex]);
    }, [poseIndex]);

    function getBodyJoints() {
        // get all poses.requirements.bodyJoint.label
        var bodyJoints = [];
        poses.forEach(pose => {
            pose.requirements.forEach(req => {
                bodyJoints.push(req.bodyJoint.label);
            });
        });
        // remove duplicates
        bodyJoints = [...new Set(bodyJoints)];
        return bodyJoints;
    }

    function addPose() {
        var newPose = {
            requirements: []
        };
        getBodyJoints().forEach(bodyJoint => {
            newPose.requirements.push({
                angleThreshold: 15,
                requiredAngle: 0,
                bodyJoint: {
                    label: bodyJoint
                }
            });
        });
        poses.push(newPose);
        setPoseIndex(poses.length - 1);
    }

    function deleteCurrentPose() {
        poses.splice(poseIndex, 1);
        setPoseIndex(poseIndex - 1)
    }

    function setRequirementAttribute(identifier, attribute, value) {
        value = parseInt(value);
        setCurrentPose(prevPose => {
            const newPose = { ...prevPose };
            var exists = false;
            const requirements = newPose.requirements.map(req => {
                if (req.bodyJoint.label === identifier) {
                    exists = true;
                    return { ...req, [attribute]: value };
                }
                return req;
            });
            if (!exists) {
                requirements.push({
                    angleThreshold: 15,
                    requiredAngle: value,
                    bodyJoint: {
                        label: identifier
                    }
                });
            }
            return { ...newPose, requirements };
        });
    }

    function deleteRequirement(identifier) {
        setCurrentPose(prevPose => {
            const newPose = { ...prevPose };
            const requirements = newPose.requirements.filter(req => req.bodyJoint.label !== identifier);
            return { ...newPose, requirements };
        });
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Canvas className="border rounded" style={{ height: editorHeight }} camera={{
                        position: [0, 1.5, 3.5],
                        rotation: [0, 0, 0]
                    }}>
                        <Suspense fallback={null}>
                            <Model pose={currentPose} setPose={setCurrentPose} editMode={editMode} setValue={setRequirementAttribute} />
                        </Suspense>
                        {/* Performance monitor */}
                        {process.env.NODE_ENV === "development" && <Perf />}
                    </Canvas>
                    <Pagination className="justify-content-center flex-wrap">
                        {poses.map((pose, index) => {
                            return (
                                <Pagination.Item key={index} onClick={() => setPoseIndex(index)} active={index === poseIndex}>
                                    Pose {index + 1}
                                </Pagination.Item>
                            )
                        })}
                        <Pagination.Item hidden={!editMode} onClick={addPose}>
                            Add Pose
                        </Pagination.Item>
                    </Pagination>
                </Col>
                <Col className="overflow-auto" style={{
                    maxHeight: editorHeight,
                    minWidth: "300px"
                }}>
                    <RawPoseEditor deleteCurrentPose={deleteCurrentPose} pose={currentPose} poseIndex={poseIndex} setValue={setRequirementAttribute} editMode={editMode} deleteRequirement={deleteRequirement} />
                </Col>
            </Row>
        </Container>
    )
}
