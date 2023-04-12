import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Row, Col, Container, Pagination } from 'react-bootstrap';

import Model from "./Model";
import RawPoseEditor from "./RawPoseEditor";


export default function PoseEditor({ poses }) {

    const [poseIndex, setPoseIndex] = useState(0);
    const [currentPose, setCurrentPose] = useState(poses[poseIndex]);

    useEffect(() => {
        setCurrentPose(poses[poseIndex]);
    }, [poseIndex]);

    const style = {
        height: "512px"
    }
    // return (
    //     <div className="d-flex flex-wrap ">
    //         <div>
    //             <Canvas style={style}>
    //                 <Suspense fallback={null}>
    //                     <Model />
    //                 </Suspense>
    //             </Canvas>
    //         </div>
    //         <div>
    //             <ul>
    //                 <li>1. Select a pose</li>
    //                 <li>2. Adjust the pose</li>
    //                 <li>3. Save the pose</li>
    //             </ul>
    //         </div>
    //     </div>
    // );

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
                    <Canvas className="border rounded" style={style} camera={{
                        position: [0, 1.5, 3.5],
                        rotation: [0, 0, 0]
                    }}>
                        <Suspense fallback={null}>
                            <Model pose={currentPose} />
                        </Suspense>

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
                <Col className="overflow-auto" style={style}>
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
