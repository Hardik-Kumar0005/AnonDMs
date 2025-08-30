"use client"

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Dog() {

  const gltf = useLoader(GLTFLoader, "/dog/scene.gltf");
  return (
      <primitive object={gltf.scene} scale={6.0} position={[0, -3, -5]} />

  );
};

export default Dog;