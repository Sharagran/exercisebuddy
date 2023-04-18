import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Row, Col, Container, Pagination } from 'react-bootstrap';
import { Stats } from "@react-three/drei";

import Model from "./Model";
import RawPoseEditor from "./RawPoseEditor";

const editorHeight = "512px";
export default function PoseEditor({ poses }) {
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

    function deleteCurrentPose() {
        poses.splice(poseIndex, 1);
        setPoseIndex(poseIndex - 1)
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
                            <Model pose={currentPose} setPose={setCurrentPose} />
                        </Suspense>
                        <Stats />
                    </Canvas>
                    <Pagination className="justify-content-center flex-wrap">
                        {poses.map((pose, index) => {
                            return (
                                <Pagination.Item key={index} onClick={() => setPoseIndex(index)} active={index === poseIndex}>
                                    Pose {index + 1}
                                </Pagination.Item>
                            )
                        })}
                        <Pagination.Item onClick={() => {
                            var newPose = {
                                requirements: []
                            };
                            getBodyJoints().forEach(bodyJoint => {
                                newPose.requirements.push({
                                    angleThreshold: 0.1,
                                    requiredAngle: 0,
                                    bodyJoint: {
                                        label: bodyJoint
                                    }
                                });
                            });
                            poses.push(newPose);
                            setPoseIndex(poses.length - 1);
                        }}>
                            Add Pose
                        </Pagination.Item>
                    </Pagination>
                </Col>
                <Col className="overflow-auto" style={{
                    height: editorHeight,
                    minWidth: "300px"
                }}>
                    {/* poses: [
                        {
                            requirements: [
                                {
                                    angleThreshold: 0.1,
                                    requiredAngle: 0.5,
                                    bodyJoint: {
                                        label: "leftShoulder",
                                        ...
                                    }
                                }
                            ]
                        }
                    ] */}
                    <RawPoseEditor deleteCurrentPose={deleteCurrentPose} pose={currentPose} poseIndex={poseIndex} setValue={(identifier, value) => {
                        value = parseInt(value);
                        var newPose = Object.assign({}, currentPose);
                        newPose.requirements.forEach(req => {
                            if (req.bodyJoint.label === identifier) {
                                req.requiredAngle = value;
                            }
                        });
                        setCurrentPose(newPose);
                    }} />
                </Col>
            </Row>
        </Container>
    )
}
