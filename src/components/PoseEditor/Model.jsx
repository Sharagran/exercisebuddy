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
    "mixamorigRightArm_017": "leftShoulder",
    "mixamorigRightForeArm_018": "leftElbow",
    "mixamorigLeftUpLeg_024": "rightHip",
    "mixamorigLeftLeg_025": "rightKnee",
    "mixamorigRightUpLeg_00": "leftHip",
    "mixamorigRightLeg_029": "leftKnee",

    "mixamorigSpine_02": null,
    "mixamorigSpine1_03": null,
    "mixamorigSpine2_04": null,
};


const edges = {
    rightShoulder: ["rightShoulder", "rightHip"],
    rightElbow: ["rightElbow", "rightShoulder"],
    rightHip: ["rightHip", "rightKnee"],
    rightKnee: ["rightKnee", "rightHip"],

    leftShoulder: ["leftShoulder", "leftHip"],
    leftElbow: ["leftElbow", "leftShoulder"],
    leftHip: ["leftHip", "leftKnee"],
    leftKnee: ["leftKnee", "leftHip"],
};

export default function Model({ getPose, setPose, pose }) {

    const [controls, setControls] = useState();
    const { camera, gl: renderer, raycaster } = useThree();
    const [highlightPoints, setHighlightPoints] = useState([]);
    const mesh = useRef();

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

        controls.addEventListener('objectChange', updateJointHighlights);

        setControls(controls);
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
        var data = {};
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                const bone = bones[key];
                data[key] = {
                    x: bone.joint.x,
                    y: bone.joint.y,
                    z: bone.joint.z
                }
            }
        }
        return data;
    }

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
    function resetPose() {
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                const bone = bones[key];
                bone.rotation.x = 0;
            }
        }
    }

    function exercisebuddyAngleToThreeAngle(angle) {
        var angle = THREE.MathUtils.degToRad(angle);
        angle = Math.abs(angle - 180);
        return angle;
    }

    function angleBetweenBones(bone1, bone2) {
        var angle = bone1.getWorldDirection(new THREE.Vector3()).angleTo(bone2.getWorldDirection(new THREE.Vector3()));
        angle = THREE.MathUtils.radToDeg(angle);
        angle = Math.round(angle);
        return angle;
    }

    function angleBetween3Points(p1, p2, p3) {
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

    function applyPose() {
        pose.requirements.forEach(req => {
            const key = req.bodyJoint.label;
            const bone = bones[key];

            const translatetAngle = THREE.MathUtils.degToRad(req.requiredAngle);

            bone.rotation.x = translatetAngle;
        });
    }

    // load simple_human.glb
    const gltf = useLoader(GLTFLoader, "/simple_human.glb");

    var bones = {};
    gltf.scene.traverse(function (node) {
        if (node.isBone) {
            if (!boneDict.hasOwnProperty(node.name)) {
                return;
            }
            var translatedName = boneDict[node.name];

            if(translatedName) {
                bones[translatedName] = node;
                bones[translatedName].color = 0xff0000;
            } else {
                bones[node.name] = node;
                bones[node.name].color = 0x00cc00;
            }
        }
    });

    // console.log(angleBetween3Points(bones.rightShoulder, bones.rightHip, bones.rightElbow));

    useEffect(() => {
        createJointHighlights();
        initControls();
    }, []);

    useHelper(mesh, THREE.SkeletonHelper, "visible");

    // useFrame is a React Three Fiber hook that allows you to run code on every frame
    useFrame(() => {
        // mesh.current.rotation.y += 0.01;
        // updateJointHighlights();
    });

    mesh.current?.add(controls);

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

    if (pose) {
        resetPose();
        applyPose();
        updateJointHighlights();
    }


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
                        const angle = angleBetweenBones(bone1, bone2);
                        console.log(key, 180 - angle);
                    }
                    console.groupEnd();
                }} />
            })}
        </>
    );

}
