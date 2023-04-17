import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { useHelper } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

// Spiegelverkehrte Bezeichner zwischen Model & Exercisebuddy app
const boneDict = {
    "mixamorigHead_06": "nose",
    "mixamorigLeftArm_09": "rightShoulder",
    "mixamorigLeftForeArm_010": "rightElbow",
    "mixamorigLeftHand_011": "rightWrist",

    "mixamorigRightArm_017": "leftShoulder",
    "mixamorigRightForeArm_018": "leftElbow",
    "mixamorigRightHand_019": "leftWrist",

    "mixamorigLeftUpLeg_024": "rightHip",
    "mixamorigLeftLeg_025": "rightKnee",
    "mixamorigLeftFoot_026": "rightAnkle",

    "mixamorigRightUpLeg_00": "leftHip",
    "mixamorigRightLeg_029": "leftKnee",
    "mixamorigRightFoot_030": "leftAnkle",

    "mixamorigSpine_02": null,
    "mixamorigSpine1_03": null,
    "mixamorigSpine2_04": null,
};

const boneDictV2 = {
    "mixamorigHead_06": {
        label: "nose",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    }
    // ...
}


const edges = {
    rightShoulder: ["rightShoulder", "rightHip", "rightElbow"],
    rightElbow: ["rightElbow", "rightShoulder", "rightWrist"],
    rightHip: ["rightHip", "rightKnee", "rightShoulder"],
    rightKnee: ["rightKnee", "rightHip", "rightAnkle"],

    leftShoulder: ["leftShoulder", "leftHip", "leftElbow"],
    leftElbow: ["leftElbow", "leftShoulder", "leftWrist"],
    leftHip: ["leftHip", "leftKnee", "leftShoulder"],
    leftKnee: ["leftKnee", "leftHip", "leftAnkle"],
};

/* poses: [
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
] */

export default function Model({ getPose, setPose, pose }) {
    const { camera, gl: renderer } = useThree();
    const mesh = useRef();

    const [controls, setControls] = useState();
    const [highlightPoints, setHighlightPoints] = useState([]);
    const [defaultPose, setDefaultPose] = useState({});

    const gltf = useLoader(GLTFLoader, "/simple_human.glb");
    useHelper(mesh, THREE.SkeletonHelper, "visible");

    // var defaultPose = {};
    var bones = {};

    setupBones(); //TODO: optimize performance
    useEffect(() => {
        // setupBones();
        createJointHighlights();
        initControls();
        // console.log(bones);
    }, []);
    // console.log(bones);

    useEffect(() => {
        if (pose) {
            resetPose();
            applyPose();
        }
    }, [pose]);

    // TODO: remove controls when not clickign on joint
    // remove controls on right click
    useEffect(() => {
        function handleRightClick(e) {
            if (e.target.nodeName === "CANVAS") {
                e.preventDefault();
                if (e.button === 2) {
                    controls.detach();
                }
            }
        }

        function handleMouseMove(e) {
            return;
            if (e.target.nodeName === "CANVAS" && e.buttons === 2) {
                mesh.current.rotation.y += e.movementX * 0.01;
                updateJointHighlights();
            }
        }
        window.addEventListener("contextmenu", handleRightClick);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("contextmenu", handleRightClick);
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [controls]);

    // useFrame is a React Three Fiber hook that allows you to run code on every frame
    useFrame(() => {
        // mesh.current.rotation.y += 0.01;
        // updateJointHighlights();
    });

    //#region Control elements
    function createJointHighlights() {
        var spheres = [];
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                const bone = bones[key];

                const geometry = new THREE.SphereGeometry(0.05, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: bone.color });
                const sphere = new THREE.Mesh(geometry, material);
                const position = new THREE.Vector3();
                sphere.position.copy(bone.getWorldPosition(position));

                // add bone ref to jointHighlight
                sphere.bone = bone;
                // add jointHighlight ref to bone
                bones[key].joint = sphere.position;

                // display sphere on top of everything
                sphere.renderOrder = 1000;
                sphere.onBeforeRender = function (renderer) {
                    renderer.clearDepth();
                }

                // scene.add(sphere);
                // if (mesh.current != null)
                //     mesh.current.add(sphere);
                spheres.push(sphere);
            }
        }
        setHighlightPoints(spheres);
    }

    function updateJointHighlights() {
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                const bone = bones[key];
                bone.joint?.copy(bone.getWorldPosition(new THREE.Vector3()));
                bones[key].joint = bone.joint;
            }
        }
    }

    function initControls() {
        // Gizmo controls for moving Joints
        const controls = new TransformControls(camera, renderer.domElement);
        controls.setMode("rotate");
        // limit rotation to x-axis
        controls.showX = false;
        controls.showY = false;

        controls.addEventListener('objectChange', function (e) {
            updateJointHighlights();
            setPose(parsePoseToData());
        });

        setControls(controls);
    }
    //#endregion

    //#region Parsing
    function angleBetweenPoints(p1, p2, p3) {
        // get world position of points
        p1 = p1.getWorldPosition(new THREE.Vector3());
        p2 = p2.getWorldPosition(new THREE.Vector3());
        p3 = p3.getWorldPosition(new THREE.Vector3());

        // calculate angle at p1 in the triangle p1-p2-p3
        var v1 = new THREE.Vector3().subVectors(p2, p1);
        var v2 = new THREE.Vector3().subVectors(p3, p1);
        var angle = v1.angleTo(v2);
        angle = THREE.MathUtils.radToDeg(angle);
        angle = Math.round(angle);
        return angle;
    }

    function parseDataToPose(data) {
        var pose = {};
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                pose[key] = {
                    x: element.x,
                    y: element.y,
                    z: element.z
                }
            }
        }
        return pose;
    }

    function parsePoseToData() {
        var newPose = { ...pose };
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                const bone = bones[key];

                // check if requirement array has element with label
                var requirement = newPose.requirements.find(req => req.bodyJoint.label === key);
                if (requirement) {
                    requirement.requiredAngle = Math.round(THREE.MathUtils.radToDeg(bone.rotation.x));
                    requirement.angleThreshold = 15; //FIXME: hardcoded
                } else {
                    console.log(bone.rotation.y);
                    newPose.requirements.push({
                        bodyJoint: {
                            label: key,
                            desiredAngle: null,
                            firstEdgeIndex: null,
                            secondEdgeIndex: null
                        },
                        requiredAngle: Math.round(THREE.MathUtils.radToDeg(bone.rotation.y)),
                        angleThreshold: 15 //FIXME: hardcoded
                    });
                }
            }
        }
        // console.log(newPose);
        // console.log(pose);
        return newPose;
    }
    //#endregion

    //#region Modify Pose
    function resetPose() {
        for (const key in bones) {
            if (Object.hasOwnProperty.call(defaultPose, key)) {
                const bone = bones[key];
                var defaultAngle = defaultPose[key];
                switch (key) {
                    case "leftHip":
                    case "leftKnee":
                    // defaultAngle.z = -defaultAngle.z;
                    // defaultAngle.x = -defaultAngle.x;
                    case "rightHip":
                    case "rightKnee":
                        bone.rotation.z = defaultAngle.z;
                        break;

                    default:
                        bone.rotation.x = defaultAngle.x;
                        break;
                }
            }
        }
    }

    function applyPose() {
        pose.requirements.forEach(req => {
            const key = req.bodyJoint.label;
            const bone = bones[key];

            if (!bone) return;

            var angle = req.requiredAngle;
            // shift 0° to 180° (180° is expended joint)
            angle = angle - 180;

            var translatetAngle = THREE.MathUtils.degToRad(angle);

            /* eslint-disable no-fallthrough */
            switch (key) {
                case "leftHip":
                case "leftKnee":
                    translatetAngle = -translatetAngle;
                case "rightHip":
                case "rightKnee":
                    bone.rotation.z = translatetAngle;
                    break;

                default:
                    bone.rotation.x = translatetAngle;
                    break;
            }
        });
    }
    //#endregion


    function setupBones() {
        gltf.scene.traverse(function (node) {
            if (node.isBone) {
                if (!boneDict.hasOwnProperty(node.name)) {
                    return;
                }
                var translatedName = boneDict[node.name];
                var boneName = translatedName || node.name;
                var color = translatedName ? 0xff0000 : 0x00cc00;

                bones[boneName] = node;
                bones[boneName].color = color;

                // check if defaultPose for bone is already set
                if (defaultPose.hasOwnProperty(boneName))
                    return;
                setDefaultPose(prevState => {
                    return {
                        ...prevState,
                        [boneName]: {
                            x: node.rotation.x,
                            y: node.rotation.y,
                            z: node.rotation.z
                        }
                    }
                });

            }
        });
    }

    mesh.current?.add(controls);


    if (pose) {
        resetPose();
        applyPose();
        updateJointHighlights();
    }

    // console.log(angleBetweenPoints(bones.rightShoulder, bones.rightHip, bones.rightElbow));

    return (
        <>
            <primitive object={gltf.scene} ref={mesh} dispose={null} />
            {highlightPoints.map((point, index) => {
                return <primitive key={point.uuid} object={point} onClick={(e) => {
                    controls.attach(e.object.bone);
                    console.log(e.object);
                    console.log(boneDict[e.object.bone.name]);

                    console.group("Angles");
                    for (const key in edges) {
                        const edge = edges[key];
                        const bone1 = bones[edge[0]];
                        const bone2 = bones[edge[1]];
                        const bone3 = bones[edge[2]];
                        const angle = angleBetweenPoints(bone1, bone2, bone3);
                        console.log(key, angle);
                    }
                    console.groupEnd();
                }} />
            })}
        </>
    );

}
