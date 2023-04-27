import React, { useState } from 'react'
import { MathUtils } from "three";

const boneDict = {
    "nose": {
        boneLabel: "mixamorigHead_06",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },

    //#region right arm 
    "rightShoulder": {
        boneLabel: "mixamorigLeftArm_09",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["rightShoulder", "rightHip", "rightElbow"],
        transform: (x) => x*2,
        inverseTransform: (x) => x/2,
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "rightElbow": {
        boneLabel: "mixamorigLeftForeArm_010",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["rightElbow", "rightShoulder", "rightWrist"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "rightWrist": {
        boneLabel: "mixamorigLeftHand_011",
        show: false,
        trackable: false,
    },
    //#endregion

    //#region left arm
    "leftShoulder": {
        boneLabel: "mixamorigRightArm_017",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["leftShoulder", "leftHip", "leftElbow"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "leftElbow": {
        boneLabel: "mixamorigRightForeArm_018",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["leftElbow", "leftShoulder", "leftWrist"],
        angleThreshold: 15,
        firstEdgeIndex: 9,
        secondEdgeIndex: 8,
    },
    "leftWrist": {
        boneLabel: "mixamorigRightHand_019",
        show: false,
        trackable: false,
    },
    //#endregion

    //#region right leg
    "rightHip": {
        boneLabel: "mixamorigLeftUpLeg_024",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 180,
        edges: ["rightHip", "rightKnee", "rightShoulder"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "rightKnee": {
        boneLabel: "mixamorigLeftLeg_025",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 0,
        edges: ["rightKnee", "rightHip", "rightAnkle"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "rightAnkle": {
        boneLabel: "mixamorigLeftFoot_026",
        show: false,
        trackable: false,
    },
    //#endregion

    //#region left leg
    "leftHip": {
        boneLabel: "mixamorigRightUpLeg_00",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 180,
        edges: ["leftHip", "leftKnee", "leftShoulder"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "leftKnee": {
        boneLabel: "mixamorigRightLeg_029",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 0,
        edges: ["leftKnee", "leftHip", "leftAnkle"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "leftAnkle": {
        boneLabel: "mixamorigRightFoot_030",
        show: false,
        trackable: false
    },
    //#endregion

    //#region spine
    "Spine_01": {
        boneLabel: "mixamorigSpine_02",
        show: true,
        trackable: false,
        defaultAngle: 0,
    },
    "Spine_02": {
        boneLabel: "mixamorigSpine1_03",
        show: true,
        trackable: false,
        defaultAngle: 0,
    },
    "Spine_03": {
        boneLabel: "mixamorigSpine2_04",
        show: true,
        trackable: false,
        defaultAngle: 0
    }
    //#endregion
}



export default function usePose(defaultPose) {
    const [pose, setPose] = useState(defaultPose);

    function getExercisebuddyPose() {

    }
    
    function getThreePose() {
    
    }

    function getPose() {
        return pose;
    }

    function updatePose(p) {
        setPose(p);
    }

    function updateRequirement(boneLabel, angle) {
        setPose(prev => {
            const newPose = { ...prev };
            const requirementLabel = boneToRequirementLabel(boneLabel);
            newPose[requirementLabel].angle = angle;
            return newPose;
        })
    }

    return {
        pose: getPose,
        setPose: updatePose,
    }
}


function getRequirementByBoneLabel(boneLabel) {
    return boneDict.find(bone => bone.boneLabel === boneLabel)
}

function boneToRequirementLabel(boneLabel) {
    for (const key in boneDict) {
        const bone = boneDict[key];
        if (bone.boneLabel === boneLabel) {
            return key;
        }
    }
}

function toExercisebuddyAngle(angle) {
    var a = MathUtils.radToDeg(angle);
    a = Math.round(a);
    a += 180;
    return a;
}

function toThreeAngle(angle) {
    var a = angle - 180;
    a = MathUtils.degToRad(a);
    return a;
}

function parseBone(bone) {
    var parsedAngle = bone.rotation[bone.angleRotationAxis];
    parsedAngle = boneDict[bone.boneLabel].transform(parsedAngle);
}



export {
    boneDict,
    boneToRequirementLabel,

    toExercisebuddyAngle,
    toThreeAngle
}
