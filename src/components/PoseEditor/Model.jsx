import React, { useRef } from "react";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { useFrame, useLoader } from "@react-three/fiber";

export default function Model() {

    const group = useRef();

    // load simple_human.glb
    const model = useLoader(GLTFLoader, "/simple_human.glb");

    // useFrame is a React Three Fiber hook that allows you to run code on every frame
    useFrame(() => {
        group.current.rotation.y += 0.01;
    });

    return (
        <primitive object={model.scene} ref={group} dispose={null} />
    );

}
