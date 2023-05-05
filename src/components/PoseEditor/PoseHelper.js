
const Edge = (origin, destination) => ({ origin, destination });

var boneDict = {
    "mixamorigHead_06": {
        label: "nose",
        show: true,
        trackable: true,
        angleRotationAxis: "x",
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
    }
    //#endregion
}

var edges = createEdges();

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


function getEdges(firstEdgeIndex, secondEdgeIndex) {
    var a = [];

    a.push(edges[firstEdgeIndex].origin);
    a.push(edges[firstEdgeIndex].destination);

    a.push(edges[secondEdgeIndex].origin);
    a.push(edges[secondEdgeIndex].destination);

    var set = new Set(a);
    return Array.from(set);
}

function getIndexofEdge(origin, destination) {
    return edges.findIndex(edge => edge.origin == origin && edge.destination == destination);
}


function fillBoneDict() {
    for (const key in boneDict) {
        const element = boneDict[key];
        if (Object.hasOwnProperty.call(element, "firstEdgeIndex") && Object.hasOwnProperty.call(element, "secondEdgeIndex")) {
            element.edges = getEdges(element.firstEdgeIndex, element.secondEdgeIndex);
        } else if (Object.hasOwnProperty.call(element, "edges")) {
            element.firstEdgeIndex = getIndexofEdge(element.edges[0], element.edges[1]);
            element.secondEdgeIndex = getIndexofEdge(element.edges[1], element.edges[2]);
        }
    }
}

fillBoneDict();

export { boneDict, edges };
