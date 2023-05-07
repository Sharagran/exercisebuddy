import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { useHelper } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";

import { boneDict, parseAngleFromExercisebuddy, parseAngleToExercisebuddy } from "./PoseHelper";

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

    if (pose) {
        resetPose();
        applyPose();
        updateJointHighlights();
    }

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

        debugBoneRotation(e);
    }

    function handleGizmoMove(e) {
        updateJointHighlights();
        if (selectedJoint.trackable) {
            updateJointAngle(selectedJoint, e.target.object.rotation);
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

    function debugBoneRotation(e) {
        return;
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

            var translatetAngle = parseAngleFromExercisebuddy(key, req.requiredAngle);


            var axis = boneDict.getBoneByLabel(key).angleRotationAxis;
            axis = axis || "x";

            bone.rotation[axis] = translatetAngle;
        });
    }

    function updateJointAngle(joint, rotation) {
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
