"use client";

import React, { Suspense } from "react";

import Cat from "@/assets/Cat";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Dog from "@/assets/Dog";
import Penguin from "@/assets/Penguin";
import Slime from "@/assets/Slime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// NOTE: Lenis must only run in the browser. We initialize it inside a useEffect below.



interface TextAnimationItem {
  segment: Element;
  originalIndex: number;
}



export default function ModelAnimation() {

  React.useEffect(() => {
    // ensure ScrollTrigger is registered synchronously so we can create triggers immediately
    try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
    let lenis: any | null = null;
    let rafId: number | null = null;
  let tweens: any[] = [];
  let cornerTweens: gsap.core.Tween[] = [];
  let scrollTriggers: ScrollTrigger[] = [];

    // dynamic import Lenis only on client
  let tickFn: ((time: number) => void) | null = null;
  (async () => {
      if (typeof window === 'undefined') return;
      const Lenis = (await import('lenis')).default;
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis();
      lenis.on('scroll', ScrollTrigger.update);

      // add lenis raf to gsap ticker
      tickFn = (time: number) => {
        if (!lenis) return;
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickFn);
      gsap.ticker.lagSmoothing(0);

      // store rafId so we can cancel if needed (not strictly necessary for Lenis)
      rafId = 1;
    })();

    // DOM-only animations (run after mount)
    try {
      
      // setup ScrollTrigger to move models
      try {
        const wrappers = Array.from(document.querySelectorAll('.model-wrapper')) as HTMLElement[];
        if (wrappers.length >= 4) {
          // store original rects/styles for restore
          const originals = wrappers.map((el) => {
            const r = el.getBoundingClientRect();
            return {
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
              style: {
                position: el.style.position || '',
                left: el.style.left || '',
                top: el.style.top || '',
                width: el.style.width || '',
                height: el.style.height || '',
                zIndex: el.style.zIndex || ''
              }
            }
          });

          const moveToCorners = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const padding = wrappers[0].getBoundingClientRect().width;
            // targets for each wrapper
            const groupWidth = padding * wrappers.length;
            const startLeft = (w - groupWidth) / 2;
            const topPos = (h - padding) / 2;
            const targets = wrappers.map((_, i) => ({
              left: startLeft + i * padding,
              top: topPos
            }));

            wrappers.forEach((el, i) => {
              const o = originals[i];
              // fix element in place first so left/top animate from viewport coords
              el.style.position = 'fixed';
              el.style.left = `${o.left}px`;
              el.style.top = `${o.top}px`;
              el.style.width = `${o.width}px`;
              el.style.height = `${o.height}px`;
              el.style.zIndex = '9999';
              cornerTweens.push(gsap.to(el, { left: targets[i].left, top: targets[i].top, duration: 0.6, ease: 'power2.out' }));
            });
          };

          const restore = () => {
            wrappers.forEach((el, i) => {
              const o = originals[i];
              cornerTweens.push(gsap.to(el, { left: o.left, top: o.top, duration: 0.45, ease: 'power2.out', onComplete: () => {
                // clear inline styles to return to layout flow
                el.style.position = originals[i].style.position;
                el.style.left = originals[i].style.left;
                el.style.top = originals[i].style.top;
                el.style.width = originals[i].style.width;
                el.style.height = originals[i].style.height;
                el.style.zIndex = originals[i].style.zIndex;
              }}));
            });
          };

          // create a ScrollTrigger that runs when #hero is scrolled one viewport down
          const st = ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: () => `+=${window.innerWidth}`,
            onEnter: moveToCorners,
            onLeaveBack: restore
          });
          scrollTriggers.push(st);
        }
      } catch (e) {}
    } catch (e) {
      // ignore if DOM not ready or elements missing
    }

    return () => {
      // cleanup
      try {
  // kill text tweens
  tweens.forEach((t) => t.kill && t.kill());
  cornerTweens.forEach((t) => t.kill && t.kill());
        gsap.ticker.lagSmoothing(1);
        if (tickFn) gsap.ticker.remove(tickFn);
      } catch (e) {}
    };
  }, []);




  return (
    <>
    <section id="hero" className="relative w-screen h-svh p-1 sm:mt-0 mt-6 flex flex-col items-center justify-center self-center bg-black overflow-hidden transition duration-300 ease-in-out">
      <div>
        <h1
          id="hero-header"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-7xl sm:text-7xl lg:text-9xl font-bold text-center"
        >
          Anon DMs
        </h1>
        <p className="text-white">A place for anonymous messaging!</p>
      </div>

      <div id="models" className="fixed bottom-4 left-4 right-4 flex sm:flex-row h-fit items-center justify-center align-middle content-center sm:gap-8 gap-0 px-4 z-2">

          {/* CAT */}
          <div className="border sm:w-50 sm:h-50 w-25 h-25 model-wrapper">
          <Canvas>
        <Suspense fallback={null}>
          <Cat position={[-1, -17, -5]} scale={3.6} />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
          </div>

          {/* DOG */}
          <div className="border sm:w-50 sm:h-50 w-25 h-25 model-wrapper">
          <Canvas>
        <Suspense fallback={null}>
          <Dog position={[0, -3, -5]} scale={3.6} />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
          </div>

          {/* PENGUIN */}
          <div className="border sm:w-50 sm:h-50 w-25 h-25 model-wrapper">
          <Canvas>
        <Suspense fallback={null}>
          <Penguin position={[0, -4, -8]} scale={3.6} />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
          </div>


          {/* SLIME */}
          <div className="border sm:w-50 sm:h-50 w-25 h-25 model-wrapper">
          <Canvas>
        <Suspense fallback={null}>
          <Slime position={[0, -15, -308]} scale={3.6} />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
          </div>



         </div>

    {/* <h1 className="relative max-w-250 text-center text-4xl line-clamp-2 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x mt-10">

        <div id="placeholder" className="-mt-3 w-15 h-15 align-middle focus-visible:hidden">Curious marmot explores hidden valley.</div>
        <span id="text-segment">Silent comets trace silver arcs.</span>
        
        <div id="placeholder">Whispering pines echo distant thunder.</div>
        <span id="text-segment">Distant bells chime over misty harbor.</span>

        <div id="placeholder">Crystal rivers carve ancient canyons.</div>
        <span id="text-segment">Autumn leaves script stories on stone.</span>

        <div id="placeholder">Midnight lantern guides wandering fireflies.</div>
        <span id="text-segment">Velvet clouds cradle early sunrise.</span>
    </h1> */}


    </section>


    <section id="outro">
      <h1>BYEEEEEE</h1>
    </section>

    </>
  )
}
