"use client"

import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRef, useEffect } from "react";
import type { Group } from "three";
import { getGlobalPointer, subscribeToGlobalPointer } from "@/utils/globalPointer";

function Dog({ position = [0, -7, -5], scale = 6 }: { position?: [number, number, number]; scale?: number }) {
  const group = useRef<Group | null>(null);
  const gltf = useLoader(GLTFLoader, "/dog/scene.gltf");

  const pointerRef = useRef(getGlobalPointer());
  useEffect(() => {
    const unsub = subscribeToGlobalPointer((p) => (pointerRef.current = p));
    return () => unsub();
  }, []);

  const rotYFactor = 0.12;
  const rotXFactor = 0.06;
  const parallax = 1.5;
  const damping = 0.06;

  useFrame(() => {
    const mouse = pointerRef.current;
    const targetRotY = mouse.x * Math.PI * rotYFactor;
    const targetRotX = mouse.y * Math.PI * rotXFactor;
    if (group.current) {
      group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.08;
      group.current.rotation.x += (targetRotX - group.current.rotation.x) * 0.06;

      const baseX = position[0];
      const baseY = position[1];
      const baseZ = position[2];
      const targetX = baseX + mouse.x * parallax;
      const targetY = baseY + -mouse.y * parallax;

      group.current.position.x += (targetX - group.current.position.x) * damping;
      group.current.position.y += (targetY - group.current.position.y) * damping;
      group.current.position.z = baseZ;
    }
  });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default Dog;