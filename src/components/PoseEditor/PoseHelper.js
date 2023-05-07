import { MathUtils } from "three";

const Edge = (origin, destination) => ({ origin, destination });

var boneDict = {
    "mixamorigHead_06": {
        label: "nose",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 0,
        edges: ["nose", "shoulderMid", "leftShoulder"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },

    //#region right arm
    "mixamorigLeftArm_09": {
        label: "rightShoulder",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["rightShoulder", "rightHip", "rightElbow"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "mixamorigLeftForeArm_010": {
        label: "rightElbow",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["rightElbow", "rightShoulder", "rightWrist"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "mixamorigLeftHand_011": {
        label: "rightWrist",
        show: false,
        trackable: false,
    },
    //#endregion

    //#region left arm
    "mixamorigRightArm_017": {
        label: "leftShoulder",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["leftShoulder", "leftHip", "leftElbow"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "mixamorigRightForeArm_018": {
        label: "leftElbow",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
        defaultAngle: 0,
        edges: ["leftElbow", "leftShoulder", "leftWrist"],
        angleThreshold: 15,
        // firstEdgeIndex: 9,
        // secondEdgeIndex: 8,
    },
    "mixamorigRightHand_019": {
        label: "leftWrist",
        show: false,
        trackable: false,
    },
    //#endregion

    //#region right leg
    "mixamorigLeftUpLeg_024": {
        label: "rightHip",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 180,
        edges: ["rightHip", "rightKnee", "rightShoulder"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "mixamorigLeftLeg_025": {
        label: "rightKnee",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 0,
        edges: ["rightKnee", "rightHip", "rightAnkle"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "mixamorigLeftFoot_026": {
        label: "rightAnkle",
        show: false,
        trackable: false,
    },
    //#endregion

    //#region left leg
    "mixamorigRightUpLeg_00": {
        label: "leftHip",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 180,
        edges: ["leftHip", "leftKnee", "leftShoulder"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "mixamorigRightLeg_029": {
        label: "leftKnee",
        show: true,
        trackable: true,
        angleRotationAxis: "z",
        defaultAngle: 0,
        edges: ["leftKnee", "leftHip", "leftAnkle"],
        // angleThreshold: 15,
        // firstEdgeIndex: 0,
        // secondEdgeIndex: 1,
    },
    "mixamorigRightFoot_030": {
        label: "leftAnkle",
        show: false,
        trackable: false
    },
    //#endregion

    //#region spine
    "mixamorigSpine_02": {
        show: true,
        trackable: false,
        defaultAngle: 0,
    },
    "mixamorigSpine1_03": {
        show: true,
        trackable: false,
        defaultAngle: 0,
    },
    "mixamorigSpine2_04": {
        show: true,
        trackable: false,
        defaultAngle: 0
    },
    //#endregion

    getBoneByLabel(label) {
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                const element = this[key];
                if (element.label === label) {
                    return element;
                }
            }
        }
        return null;
    }
}

function createEdges() {
    var edges = [];

    edges.push(Edge("nose", "leftEye"));
    edges.push(Edge("nose", "rightEye"));
    edges.push(Edge("nose", "shoulderMid"));
    edges.push(Edge("leftEye", "leftEar"));
    edges.push(Edge("leftEye", "rightEye"));
    edges.push(Edge("rightEye", "rightEar"));
    edges.push(Edge("leftShoulder", "rightShoulder"));//6
    //Maybe connect left and right shoulders with shoulderMid
    edges.push(Edge("nose", "eyeMid"));
    //new ones for full body tracking
    edges.push(Edge("leftShoulder", "leftElbow"));
    edges.push(Edge("leftElbow", "leftWrist"));
    edges.push(Edge("rightShoulder", "rightElbow"));//10
    edges.push(Edge("rightElbow", "rightWrist"));
    edges.push(Edge("leftShoulder", "leftHip"));
    edges.push(Edge("leftHip", "leftKnee"));
    edges.push(Edge("leftKnee", "leftAnkle"));
    edges.push(Edge("rightShoulder", "rightHip"));//15
    edges.push(Edge("rightHip", "rightKnee"));
    edges.push(Edge("rightKnee", "rightAnkle"));
    edges.push(Edge("rightHip", "leftHip"));


    for (var i = 0; i < edges.length; i++) {
        edges[i].index = i;
    }

    return edges;
}

// FIXME: indices might be in the wrong order
function getEdgeIndices(edgesArray) {
    var r = [];
    edges.forEach(edge => {
        if (edgesArray.includes(edge.origin) && edgesArray.includes(edge.destination)) {
            r.push(edge.index);
        }
    });
    return r;
}

function translateEdgeIndices() {
    for (const key in boneDict) {
        if (Object.hasOwnProperty.call(boneDict, key)) {
            const element = boneDict[key];
            if (element.edges && (!element.firstEdgeIndex || !element.secondEdgeIndex)) {
                var edgeIndices = getEdgeIndices(element.edges);
                element.firstEdgeIndex = edgeIndices[0];
                element.secondEdgeIndex = edgeIndices[1];
            }
        }
    }
}

// javascript modulo operator is broken for negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

/** 
 * @description Converts an angle from the exercisebuddy app/database to an angle that can be used in the pose editor
 * @param {string} label
 * @param {number} angle
 * @returns {number} translated angle
 * 
*/
function parseAngleFromExercisebuddy(label, angle) {
    //#region angle shift (start point)
    // shift 0° to 180° (180° is expended joint)
    if (!label.includes("Hip")) {
        angle = angle - 180;
    }

    switch (label) {
        case "nose":
        case "rightShoulder":
        case "leftShoulder":
            angle += 90;
            break;
        default:
            break;
    }

    var translatetAngle = MathUtils.degToRad(angle);
    //#endregion

    //#region angle rotation (direction & angle)
    if (label === "nose" || label === "rightHip" || label === "leftKnee" || label.includes("Shoulder")) {
        translatetAngle = -translatetAngle;
    }

    //#endregion
    return translatetAngle;
}

// inverse function of parseAngleFromExercisebuddy
function parseAngleToExercisebuddy(label, angle) {
    //#region angle rotation (direction & angle)
    if (label === "nose" || label === "rightHip" || label === "leftKnee" || label.includes("Shoulder")) {
        angle = -angle;
    }

    var translatetAngle = MathUtils.radToDeg(angle);
    translatetAngle = Math.round(translatetAngle);

    //#endregion
    //#region angle shift (start point)
    switch (label) {
        case "nose":
        case "rightShoulder":
        case "leftShoulder":
            translatetAngle -= 90;
            break;
        default:
            break;
    }

    // shift 0° to 180° (180° is expended joint)
    if (!label.includes("Hip")) {
        translatetAngle = translatetAngle + 180;
    }
    //#endregion

    // required to prevent negative angles
    translatetAngle = mod(translatetAngle, 360);

    return translatetAngle;
}

var edges = createEdges();
translateEdgeIndices();

export { boneDict, parseAngleToExercisebuddy, parseAngleFromExercisebuddy };
