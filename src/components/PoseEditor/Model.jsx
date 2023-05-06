import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { useHelper } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

import { boneDict, parseAngleToExercisebuddy } from "./PoseHelper";

var selectedJoint = null;
export default function Model({ pose, setValue, editMode }) {
    const { camera, gl: renderer } = useThree();
    const mesh = useRef();

    const [controls, setControls] = useState();
    const [highlightPoints, setHighlightPoints] = useState([]);

    const gltf = useLoader(GLTFLoader, "/simple_human.glb");
    useHelper(mesh, THREE.SkeletonHelper, "visible");

    var bones = {};

    setupBones(); //TODO: optimize performance
    useEffect(() => {
        // setupBones();
        createJointHighlights();
        initControls();
    }, []);

    useEffect(() => {
        if (pose) {
            resetPose();
            applyPose();
            updateJointHighlights();
        }
    }, [pose]);
    
    useEffect(() => {
        function handleRightClick(e) {
            if (e.target.nodeName === "CANVAS") {
                e.preventDefault();
                if (e.button === 2) {
                    console.log("right click");
                    controls.detach();
                    selectedJoint = null;
                }
            }
        }

        function handleMouseMove(e) {
            if (e.target.nodeName === "CANVAS" && e.buttons === 2) {
                rotateCamera(-e.movementX * 0.01);
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

                if(boneDict[bone.name].show === false) {
                    continue;
                }

                const geometry = new THREE.SphereGeometry(0.05, 8, 8);
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
        // limit rotation to z-axis
        controls.showX = false;
        controls.showY = false;

        controls.addEventListener('objectChange', handleGizmoMove);

        setControls(controls);
        mesh.current?.add(controls);
    }

    function handleJointClick(e) {
        if(!editMode) return;

        controls.attach(e.object.bone);
        selectedJoint = boneDict[e.object.bone.name];

        // TODO: remove code below debug only
        console.log(e.object.bone.name, boneDict[e.object.bone.name].label);
        console.groupCollapsed("Angles");
        for (const key in boneDict) {
            if (Object.hasOwnProperty.call(boneDict[key], "edges")) {
                const edges = boneDict[key].edges;
                const angle = angleBetweenPoints(...edges.map(e => bones[e]));
                console.log(boneDict[key].label, angle);
            }
        }
        console.groupEnd();
        console.groupCollapsed("Rquirements");
        for (const key in pose.requirements) {
            const req = pose.requirements[key];
            console.log(req.bodyJoint.label, req.requiredAngle);
        }
        console.groupEnd();
    }

    function handleGizmoMove(e) {
        updateJointHighlights();
        if (selectedJoint.trackable) {
            updateJointAngle(selectedJoint, e.target.object.rotation.x);
        }
    }

    function rotateCamera(rotation) {
        var x = camera.position.x;
        var z = camera.position.z;
        camera.position.x = x * Math.cos(rotation) + z * Math.sin(rotation);
        camera.position.z = z * Math.cos(rotation) - x * Math.sin(rotation);
        camera.lookAt(0, 1.5, 0);
    }
    //#endregion

    //#region Parsing
    function angleBetweenPoints(p1, p2, p3) {
        // get world position of points
        p1 = p1.getWorldPosition(new THREE.Vector3());
        p2 = p2.getWorldPosition(new THREE.Vector3());
        p3 = p3.getWorldPosition(new THREE.Vector3());

        // calculate angle at p1 in the triangle p1-p2-p3
        // var v1 = new THREE.Vector3().subVectors(p2, p1);
        // var v2 = new THREE.Vector3().subVectors(p3, p1);
        // var angle = v1.angleTo(v2);
        // angle = THREE.MathUtils.radToDeg(angle);
        // angle = Math.round(angle);
        // return angle;

        // calculate angle at p1 in the triangle p1-p2-p3
        // angle: 0-360
        var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.atan2(p3.y - p1.y, p3.x - p1.x);
        angle = THREE.MathUtils.radToDeg(angle);
        if (angle < 0) angle += 360;
        angle = Math.round(angle);
        return angle;
    }

    function parsePoseToData() {
        var newPose = { ...pose };
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                const bone = bones[key];

                if (Object.hasOwnProperty.call(boneDict, key) === false) continue;
                if (boneDict[key].trackable === false) continue;

                console.log(boneDict[key]);
                var angle = angleBetweenPoints(...boneDict[key].edges);
                switch (key) {
                    case "leftHip":
                    case "leftKnee":
                    // angle = 180 - angle;
                    case "rightHip":
                    case "rightKnee":
                    // angle = 180 - angle;
                    // angle = Math.round(THREE.MathUtils.radToDeg(bone.rotation.z));
                    default:
                        // angle = Math.round(THREE.MathUtils.radToDeg(bone.rotation.x));
                        break;
                }


                angle = 180;
                // check if requirement array has element with label
                var requirement = newPose.requirements.find(req => req.bodyJoint.label === key);
                if (requirement) {
                    // requirement.requiredAngle = Math.round(THREE.MathUtils.radToDeg(bone.rotation.x));
                    requirement.requiredAngle = angle;
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
                        // requiredAngle: Math.round(THREE.MathUtils.radToDeg(bone.rotation.y)),
                        requiredAngle: angle,
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
        for (const key in boneDict) {
            if (Object.hasOwnProperty.call(boneDict[key], "angleRotationAxis")) {
                const bone = boneDict[key];
                bones[bone.label].rotation[bone.angleRotationAxis] = THREE.MathUtils.degToRad(bone.defaultAngle);
                // bones[bone.label].rotation[bone.angleRotationAxis] = THREE.MathUtils.degToRad(180);
            }
        }
    }

    function applyPose() {
        pose.requirements.forEach(req => {
            const key = req.bodyJoint.label;
            const bone = bones[key];

            if (!bone) return;

            //#region angle shift (start point)
            // TODO: angle transform required
            var angle = req.requiredAngle;
            // shift 0° to 180° (180° is expended joint)
            if (!key.includes("Hip")) {
                angle = angle - 180;
            }

            var translatetAngle = THREE.MathUtils.degToRad(angle);
            //#endregion

            //#region angle rotation (direction & angle)
            var axis = boneDict.getBoneByLabel(key).angleRotationAxis;
            axis = axis || "x";

            if (key === "nose" || key === "rightHip" || key === "leftKnee" || key.includes("Shoulder")) {
                translatetAngle = -translatetAngle;
            }

            bone.rotation[axis] = translatetAngle;

            /* eslint-disable no-fallthrough */
            // switch (key) {
            //     case "leftHip":
            //     case "leftKnee":
            //         translatetAngle = -translatetAngle;
            //     case "rightHip":
            //     case "rightKnee":
            //         bone.rotation.z = translatetAngle;
            //         break;

            //     default:
            //         bone.rotation.x = translatetAngle;
            //         break;
            // }
            //#endregion
        });
    }

    function updateJointAngle(joint, angle) {
        // TODO: angle transform required

        // var angle = e.target.object.rotation.x;
        angle = THREE.MathUtils.radToDeg(angle);
        angle = Math.round(angle);
        angle = angle + 180;
        setValue(joint.label, 'requiredAngle', angle);
    }
    //#endregion


    function setupBones() {
        gltf.scene.traverse(function (node) {
            if (node.isBone) {
                if (!boneDict.hasOwnProperty(node.name)) {
                    return;
                }

                var translatedName = boneDict[node.name].label;
                var boneName = translatedName || node.name;
                var color = translatedName ? 0xff0000 : 0x00cc00;

                bones[boneName] = node;
                bones[boneName].color = color;
            }
        });
    }


    return (
        <>
            <primitive object={gltf.scene} ref={mesh} dispose={null} />
            {highlightPoints.map((point, index) => {
                return <primitive key={point.uuid} object={point} onClick={handleJointClick} />
            })}
        </>
    );

}
