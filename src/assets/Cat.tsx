"use client"

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Cat() {

  const gltf = useLoader(GLTFLoader, "/cat/scene.gltf");
  return (
      <primitive object={gltf.scene} scale={6.0} position={[-1, -29, -5]} />

  );
};

export default Cat;