import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { useHelper } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";

import { boneDict, edges, parseAngleFromExercisebuddy, parseAngleToExercisebuddy } from "./PoseHelper";

var selectedJoint = null;
var defaultPose = {};
var bones = {};

export default function Model({ pose, setValue, editMode, sideView, rightViewAngle, setDebugData }) {
    const { camera, gl: renderer } = useThree();
    const mesh = useRef();

    const [controls, setControls] = useState();
    const [highlightPoints, setHighlightPoints] = useState([]);

    const gltf = useLoader(GLTFLoader, "/simple_human.glb");
    useHelper(mesh, THREE.SkeletonHelper, "visible");


    useEffect(() => {
        setupBones();
        createJointHighlights();
        initControls();
    }, []);

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

    useEffect(() => {
        console.log("sideView changed");
        resetPose();
        if (sideView) {
            if (rightViewAngle) {
                mesh.current?.rotation.set(0, -Math.PI / 2, 0);
            } else {
                mesh.current?.rotation.set(0, Math.PI / 2, 0);
            }

            setSideViewRotations();
        } else {
            mesh.current?.rotation.set(0, 0, 0);
        }
        applyPose();
        updateJointHighlights();
    }, [sideView, rightViewAngle]);

    if (pose) {
        if (bones && Object.keys(bones).length > 0) {
            resetPose();
            applyPose();
            updateJointHighlights();

            setDebugData(getAllRotations()); //FIXME: causing rerender loop
        }
    }

    function setDefaultPose() {
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                if (Object.hasOwnProperty.call(defaultPose, key)) continue;
                const bone = bones[key];
                defaultPose[key] = bone.rotation.clone();
            }
        }
    }

    //#region Control elements
    function createJointHighlights() {
        var spheres = [];
        for (const key in bones) {
            if (Object.hasOwnProperty.call(bones, key)) {
                const bone = bones[key];

                if (boneDict[bone.name].show === false) {
                    continue;
                }

                const geometry = new THREE.SphereGeometry(0.05, 8, 8);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const sphere = new THREE.Mesh(geometry, material);
                const position = new THREE.Vector3();
                sphere.position.copy(bone.getWorldPosition(position));

                // add bone ref to jointHighlight
                sphere.bone = bone;
                // add jointHighlight ref to bone
                // bones[key].joint = sphere.position;
                bones[key].jointHighlight = sphere;

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
                bone.jointHighlight?.position?.copy(bone.getWorldPosition(new THREE.Vector3()));
                bones[key].jointHighlight = bone.jointHighlight;

                // change color of jointHighlight if value is set
                if (bones[key].jointHighlight?.material) {
                    if (pose.requirements.find(req => req.bodyJoint.label === key)) {
                        bones[key].jointHighlight.material.color.setHex(0x00cc00);
                    } else {
                        bones[key].jointHighlight.material.color.setHex(0xff0000);
                    }
                }
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
        if (!editMode) return;

        controls.attach(e.object.bone);
        selectedJoint = boneDict[e.object.bone.name];
    }

    function handleGizmoMove(e) {
        updateJointHighlights();
        updateJointAngle(selectedJoint, e.target.object.rotation);
    }

    function rotateCamera(rotation) {
        var x = camera.position.x;
        var z = camera.position.z;
        camera.position.x = x * Math.cos(rotation) + z * Math.sin(rotation);
        camera.position.z = z * Math.cos(rotation) - x * Math.sin(rotation);
        camera.lookAt(0, 1.5, 0);
    }
    //#endregion

    function getAllRotations() {
        var rotations = [];
        for (const key in boneDict) {
            if (Object.hasOwnProperty.call(boneDict[key], "firstEdgeIndex") && Object.hasOwnProperty.call(boneDict[key], "secondEdgeIndex") ) {
                const joint = boneDict[key];

                const firstEdgeIndex = joint.firstEdgeIndex;
                const secondEdgeIndex = joint.secondEdgeIndex;
                const angle = calculateEdgeAngle(
                    edges[firstEdgeIndex],
                    edges[secondEdgeIndex],
                    true,
                    true
                );

                const parsedAngle = parseAngleToExercisebuddy(joint.label, angle);
                rotations.push({ label: boneDict[key].label, value: `${parsedAngle}°` });
            }
        }
        return rotations;
    }

    //#region Parsing

    function calculateEdgeAngle(edge1, edge2, returnAsRadians = false, calcFullAngle = false) {
        if (!edge1 || !edge2) return null;

        const d1 = bones[edge1.destination].getWorldPosition(new THREE.Vector3());
        const o1 = bones[edge1.origin].getWorldPosition(new THREE.Vector3());

        const d2 = bones[edge2.destination].getWorldPosition(new THREE.Vector3());
        const o2 = bones[edge2.origin].getWorldPosition(new THREE.Vector3());
        // get Delta
        edge1 = new THREE.Vector3().subVectors(d1, o1);
        edge2 = new THREE.Vector3().subVectors(d2, o2);


        var angle;
        if (!edge2) {
            //if no second edge is provided, calculate angle with horizontal line
            angle = edge1.angleTo(new THREE.Vector3(1, 0, 0));
        } else {
            if (calcFullAngle) {
                if (!sideView) {
                    angle = Math.atan2(edge1.y, edge1.x) - Math.atan2(edge2.y, edge2.x); //Produces -180 to 180 degree angles
                } else {
                    // TODO: check if this is correct
                    angle = Math.atan2(edge1.z, edge1.x) - Math.atan2(edge2.z, edge2.x); //Produces -180 to 180 degree angles
                }
            } else {
                angle = edge1.angleTo(edge2); // only gives 0 to 180 degrees
            }
        }

        if (!returnAsRadians) {
            angle = THREE.MathUtils.radToDeg(angle);
            if (calcFullAngle) {
                angle = (angle + 360) % 360;
            }

            angle = Math.round(angle);
        }

        return angle;
    }

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

    function angleBetweenThreePoints(p1, apex, p3) {

        p1 = p1.getWorldPosition(new THREE.Vector3());
        apex = apex.getWorldPosition(new THREE.Vector3());
        p3 = p3.getWorldPosition(new THREE.Vector3());

        var edge1Delta = new THREE.Vector3().subVectors(p1, apex);
        var edge2Delta = new THREE.Vector3().subVectors(p3, apex);

        // var angleInRadians = atan2(edge.getDelta.y, edge.getDelta.x)-atan2(edge2.getDelta.y, edge2.getDelta.x);
        var angleInRadians = Math.atan2(edge1Delta.y, edge1Delta.x) - Math.atan2(edge2Delta.y, edge2Delta.x);
        var angle = THREE.MathUtils.radToDeg(angleInRadians);
        angle = Math.round(angle);
        angle = (angle + 360) % 360;

        return angle;

        // var angle;
        // angle = Math.atan2(p3.y - apex.y, p3.x - apex.x) - Math.atan2(p1.y - apex.y, p1.x - apex.x);
        // angle = THREE.MathUtils.radToDeg(angle);
        // angle = Math.round(angle);
        // angle = (angle + 360) % 360;
        // return angle;

        // p1 = p1.getWorldPosition(new THREE.Vector3());
        // apex = apex.getWorldPosition(new THREE.Vector3());
        // p3 = p3.getWorldPosition(new THREE.Vector3());
        // // console.log(p1, apex, p3);
        // var v1 = new THREE.Vector3();
        // var v2 = new THREE.Vector3();
        // v1.subVectors(apex, p1);
        // v2.subVectors(apex, p3);

        // var angle = v1.angleTo(v2);
        // angle = THREE.MathUtils.radToDeg(angle);
        // return angle;
    }

    //#endregion

    //#region Modify Pose
    function resetPose() {
        for (const key in boneDict) {
            if (Object.hasOwnProperty.call(boneDict[key], "angleRotationAxis")) {
                const bone = boneDict[key];
                var axis = bone.angleRotationAxis;
                if (sideView) {
                    axis = transformAxis(key, axis);
                }
                // bones[bone.label].rotation[axis] = THREE.MathUtils.degToRad(bone.defaultAngle);
                bones[bone.label].rotation.x = defaultPose[bone.label].x;
                bones[bone.label].rotation.y = defaultPose[bone.label].y;
                bones[bone.label].rotation.z = defaultPose[bone.label].z;
            }
        }
    }

    function applyPose() {
        pose.requirements.forEach(req => {
            const key = req.bodyJoint.label;
            const bone = bones[key];

            if (!bone) return;
            var joint = boneDict.getBoneByLabel(key);

            if (!joint.trackable) return;

            var translatetAngle = parseAngleFromExercisebuddy(key, req.requiredAngle);
            var axis = joint.angleRotationAxis;
            axis = axis || "x";

            if (sideView) {
                axis = transformAxis(key, axis);
            }

            bone.rotation[axis] = translatetAngle;
        });
    }

    function transformAxis(key, axis) {
        if (key.includes("Elbow")) {
            return "z";
        }

        if (key.includes("Shoulder")) {
            return "z";
        }


        if (axis === "x") {
            return "y";
        } else if (axis === "z") {
            return "x";
        }
    }

    // setSideViewRotations();
    function setSideViewRotations() {
        bones["leftShoulder"].rotation.x = THREE.MathUtils.degToRad(90);
        bones["rightShoulder"].rotation.x = THREE.MathUtils.degToRad(90);
    }

    function updateJointAngle(joint, rotation) {
        if (!joint.trackable) {
            return;
        }

        var axis = boneDict.getBoneByLabel(joint.label).angleRotationAxis;
        axis = axis || "x";

        var translatetAngle = parseAngleToExercisebuddy(joint.label, rotation[axis]);
        setValue(joint.label, 'requiredAngle', translatetAngle);
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

                bones[boneName] = node;
            }
        });

        setDefaultPose();
    }

    return (
        <>
            <primitive object={gltf.scene} ref={mesh} dispose={null} />
            {!sideView &&
                highlightPoints.map((point, index) => {
                    return <primitive key={point.uuid} object={point} onClick={handleJointClick} />
                })
            }
        </>
    );

}
