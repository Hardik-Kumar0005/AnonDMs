"use client"

import Image from "next/image";
import Navbar from "./Navbar"
import { Suspense } from "react";

import Cat from "@/assets/Cat";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <>
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 min-w-fit">
      <Navbar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="bg-cyan-400 w-screen h-svh align-middle content-center">

          {/* CAT */}
          <div className="bg-amber-400 w-50 h-50 mx-auto">
          <Canvas>
        <Suspense fallback={null}>
          <Cat />
          <OrbitControls />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
          </div>

         </div>
         <div className="bg-amber-400 w-screen h-svh content-center">
           helo2
         </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        bye
      </footer>
    </div>
    </>
  );
}
