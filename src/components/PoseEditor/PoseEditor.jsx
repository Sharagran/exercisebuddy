import React, { Suspense, useEffect, useState } from "react";
import { Row, Col, Container, Pagination, Button, Form } from 'react-bootstrap';

import { Canvas } from "@react-three/fiber";
import { Perf } from 'r3f-perf'

import Model from "./Model";
import RawPoseEditor from "./RawPoseEditor";

import { boneDict } from "./PoseHelper";

const editorHeight = "512px";
export default function PoseEditor({ poses, setPoses, editMode }) {
    const [poseIndex, setPoseIndex] = useState(0); // index of current pose
    const [rightViewAngle, setRightViewAngle] = useState(true);

    var sideView = poses[poseIndex]?.isSide;

    useEffect(() => {
        if (poseIndex >= poses.length) {
            setPoseIndex(poses.length - 1);
        }
    }, [poses]);

    function addPose() {
        var newPose = {
            requirements: []
        };

        poses.push(newPose);
        setPoseIndex(poses.length - 1);
    }

    function deleteCurrentPose() {
        poses.splice(poseIndex, 1);
        setPoseIndex(poseIndex - 1)
    }

    function setRequirementAttribute(identifier, attribute, value) {
        value = parseInt(value);

        var newPoses = [...poses];
        var exists = false;
        newPoses[poseIndex].requirements = newPoses[poseIndex].requirements.map(req => {
            if (req.bodyJoint.label === identifier) {
                exists = true;
                return { ...req, [attribute]: value };
            }
            return req;
        }
        );

        if (!exists) {
            var requirementDefauls;

            for (const key in boneDict) {
                if (Object.hasOwnProperty.call(boneDict, key)) {
                    const bone = boneDict[key];
                    if (bone.label === identifier) {
                        requirementDefauls = bone;
                        break;
                    }
                }
            }

            newPoses[poseIndex].requirements.push({
                bodyJoint: {
                    label: identifier,
                    firstEdgeIndex: requirementDefauls.firstEdgeIndex,
                    secondEdgeIndex: requirementDefauls.secondEdgeIndex
                },
                requiredAngle: value,
                angleThreshold: 15
            });
        }

        setPoses(newPoses);
    }

    function deleteRequirement(identifier) {
        var newPoses = [...poses];
        newPoses[poseIndex].requirements = newPoses[poseIndex].requirements.filter(req => req.bodyJoint.label !== identifier);
        setPoses(newPoses);
    }

    console.log(poses);
    return (
        <Container>
            <Row>
                <Col>
                    <div className="mb-2">
                        <h6>Pose type:</h6>
                        <Pagination className="justify-content-center">
                            <Pagination.Item disabled={!editMode} active={!sideView} onClick={() => {
                                var newPose = poses[poseIndex];
                                newPose.isSide = false;
                                poses[poseIndex] = newPose;
                                setPoses([...poses]);
                            }}>
                                front-to-camera pose
                            </Pagination.Item>
                            <Pagination.Item disabled={!editMode} active={sideView} onClick={() => {
                                var newPose = poses[poseIndex];
                                newPose.isSide = true;
                                poses[poseIndex] = newPose;
                                setPoses([...poses]);
                            }}>
                                side-to-camera pose
                            </Pagination.Item>
                        </Pagination>

                        <div className="d-flex justify-content-center">
                            <Button variant="secondary" hidden={!sideView} onClick={() => {
                                setRightViewAngle(!rightViewAngle);
                            }}>
                                flip to {rightViewAngle ? "Left" : "Right"} view angle
                            </Button>
                        </div>
                    </div>
                    <div className="mb-2">
                        <Canvas className="border rounded" style={{ height: editorHeight }} camera={{
                            position: [0, 1.5, 3.5],
                            rotation: [0, 0, 0]
                        }}>
                            <Suspense fallback={null}>
                                <Model pose={poses[poseIndex]} setValue={setRequirementAttribute} editMode={editMode} sideView={sideView} rightViewAngle={rightViewAngle} />
                            </Suspense>
                            {/* Performance monitor */}
                            {process.env.NODE_ENV === "development" && <Perf />}
                        </Canvas>
                        {sideView &&
                            <Form.Text muted>
                                Note: Gizmo controls for drag and drop rotation of joints are not available in side view.
                            </Form.Text>
                        }
                    </div>
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
                    <RawPoseEditor pose={poses[poseIndex]} poseIndex={poseIndex} editMode={editMode}
                        setValue={setRequirementAttribute} deleteCurrentPose={deleteCurrentPose} deleteRequirement={deleteRequirement} />
                </Col>
            </Row>
        </Container>
    )
}
