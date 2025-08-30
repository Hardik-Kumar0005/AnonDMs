"use client"

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Slime() {

  const gltf = useLoader(GLTFLoader, "/slime/scene.gltf");
  return (
      <primitive object={gltf.scene} scale={6.0} position={[39, -29, -320]} />

  );
};

export default Slime;