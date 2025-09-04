"use client"

import Image from "next/image";
import Navbar from "./Navbar"

import HeroAnimation from "@/components/HeroAnimation";

export default function Home() {
  return (
    <>
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 min-w-fit">
      <Navbar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-screen">
 
         <HeroAnimation />

      </main>
    </div>
    </>
  );
}
