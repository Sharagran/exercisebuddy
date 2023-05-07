import React, { Suspense, useEffect, useState } from "react";
import { Row, Col, Container, Pagination } from 'react-bootstrap';

import { Canvas } from "@react-three/fiber";
import { Perf } from 'r3f-perf'

import Model from "./Model";
import RawPoseEditor from "./RawPoseEditor";

import { boneDict } from "./PoseHelper";

const editorHeight = "512px";
export default function PoseEditor({ poses, setPoses, editMode }) {
    const [poseIndex, setPoseIndex] = useState(0); // index of current pose

    // FIXME: currentPose & poses are not in sync, discard changes not working properly

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

    return (
        <Container>
            <Row>
                <Col>
                    <Canvas className="border rounded" style={{ height: editorHeight }} camera={{
                        position: [0, 1.5, 3.5],
                        rotation: [0, 0, 0]
                    }}>
                        <Suspense fallback={null}>
                            <Model pose={poses[poseIndex]} editMode={editMode} setValue={setRequirementAttribute} />
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
                    <RawPoseEditor pose={poses[poseIndex]} poseIndex={poseIndex} editMode={editMode}
                    setValue={setRequirementAttribute} deleteCurrentPose={deleteCurrentPose} deleteRequirement={deleteRequirement} />
                </Col>
            </Row>
        </Container>
    )
}
