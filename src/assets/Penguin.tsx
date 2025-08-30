"use client"

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Penguin() {

  const gltf = useLoader(GLTFLoader, "/penguin/scene.gltf");
  return (
      <primitive object={gltf.scene} scale={6.0} position={[0, -4, -10]} />

  );
};

export default Penguin;