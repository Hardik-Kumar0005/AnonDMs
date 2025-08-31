"use client";


import React from 'react'
import Image from 'next/image'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Lenis from 'lenis';

// Extend window type to include duplicateIcons
declare global {
  interface Window {
    duplicateIcons?: HTMLElement[] | null;
    containerMoveY: number;

  }
}

gsap.registerPlugin(ScrollTrigger);

export default function HeroAnimation() {

    // Initialize a new Lenis instance for smooth scrolling
    React.useEffect(() => {

        const lenis = new Lenis();
        
        // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
        lenis.on('scroll', ScrollTrigger.update);
        
        // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
        // This ensures Lenis's smooth scroll animation updates on each GSAP tick
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000); // Convert time from seconds to milliseconds
        });
        
        // Disable lag smoothing in GSAP to prevent any delay in scroll animations
        gsap.ticker.lagSmoothing(0);
    },[])


    React.useEffect(() => {
      const header = document.getElementById("hero-header");
      const images = document.getElementById("images");
      if (!header || !images) return;

      const imagesArray = Array.from(images.children) as HTMLElement[];
      const textSegments = document.querySelectorAll<HTMLElement>(".dynamic-text");
      const placeholderIcons = document.querySelectorAll<HTMLElement>(".placeholder-icon");

      // Prepare text fade-in random order
      const textAnimationOrder: { segment: HTMLElement; originalIndex: number }[] = [];
      textSegments.forEach((segment, index) => {
        textAnimationOrder.push({ segment, originalIndex: index });
        gsap.set(segment, { opacity: 0 });
      });
      for (let i = textAnimationOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [textAnimationOrder[i], textAnimationOrder[j]] = [textAnimationOrder[j], textAnimationOrder[i]];
      }

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const headerIconSize = isMobile ? 30 : 60;

      const STAGE_1_END = 0.4; // header fade + images rise
      const STAGE_2_END = 0.7; // duplicates travel to placeholders
      // stage 3 (text fade) starts after 0.7

      const trigger = ScrollTrigger.create({
        // Use the actual section id instead of a missing class to ensure correct pinning
        trigger: "#hero-section",
        start: "top top",
        end: `+=${window.innerHeight * 6}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        // markers: true, // uncomment for debugging start/end positions
        onUpdate: (self) => {
          const p = self.progress;

          // Stage 1: header fade/move + images rise
          if (p <= STAGE_1_END) {
            const t = p / STAGE_1_END; // 0 ->1
            const headerMoveY = -100 * t;
            gsap.set(header, { transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`, opacity: 1 - t });

            // Remove duplicates if coming back up
            if (window.duplicateIcons) {
              window.duplicateIcons.forEach(d => d.remove());
              window.duplicateIcons = null;
            }
            // Move original images upward (from bottom to approx mid viewport)
            const riseDistance = window.innerHeight * 0.45; // tune height
            gsap.set(images, { y: -riseDistance * t, opacity: 1 });
          }
          // Stage 2: create duplicates once & move them to placeholder icons while fading originals
          else if (p <= STAGE_2_END) {
            const t = (p - STAGE_1_END) / (STAGE_2_END - STAGE_1_END); // 0 ->1
            gsap.set(header, { opacity: 0 });

            // Create duplicates at the moment we enter stage 2
            if (!window.duplicateIcons) {
              window.duplicateIcons = [];
              imagesArray.forEach(image => {
                const rect = image.getBoundingClientRect();
                const duplicate = image.cloneNode(true) as HTMLElement;
                duplicate.className = "duplicate";
                Object.assign(duplicate.style, {
                  position: 'fixed',
                  left: `${rect.left}px`,
                  top: `${rect.top}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`,
                  zIndex: '100',
                  willChange: 'transform,left,top'
                });
                duplicate.dataset.startLeft = `${rect.left}`;
                duplicate.dataset.startTop = `${rect.top}`;
                duplicate.dataset.startWidth = `${rect.width}`;
                document.body.appendChild(duplicate);
                window.duplicateIcons!.push(duplicate);
              });
            }

            // Fade originals out once duplicates exist
            gsap.set(images, { opacity: 0 });

            // Move duplicates towards their placeholder targets
            if (window.duplicateIcons) {
              window.duplicateIcons.forEach((dup, i) => {
                if (i < placeholderIcons.length) {
                  const startLeft = parseFloat(dup.dataset.startLeft!);
                  const startTop = parseFloat(dup.dataset.startTop!);
                  const startWidth = parseFloat(dup.dataset.startWidth!);
                  const endRect = placeholderIcons[i].getBoundingClientRect();
                  const endX = endRect.left + (endRect.width - headerIconSize) / 2;
                  const endY = endRect.top + (endRect.height - headerIconSize) / 2;

                  const currentX = gsap.utils.interpolate(startLeft, endX, t);
                  const currentY = gsap.utils.interpolate(startTop, endY, t);
                  const currentScale = gsap.utils.interpolate(startWidth, headerIconSize, t) / startWidth;
                  gsap.set(dup, { left: `${currentX}px`, top: `${currentY}px`, transform: `scale(${currentScale})` });
                }
              });
            }
          }
          // Stage 3+: text fade in after images placed
          else {
            gsap.set(header, { opacity: 0 });
            if (!window.duplicateIcons) return; // safety
            // lock duplicates to final spot
            window.duplicateIcons.forEach((dup, i) => {
              if (i < placeholderIcons.length) {
                const endRect = placeholderIcons[i].getBoundingClientRect();
                const endX = endRect.left + (endRect.width - headerIconSize) / 2;
                const endY = endRect.top + (endRect.height - headerIconSize) / 2;
                gsap.set(dup, { left: `${endX}px`, top: `${endY}px`, transform: `scale(${headerIconSize / parseFloat(dup.dataset.startWidth!)} )` });
              }
            });

            const t = (p - STAGE_2_END) / (1 - STAGE_2_END); // 0 ->1
            // start fade after 20% into stage 3 for extra delay
            const fadeStart = 0.2;
            const fadeProgress = t < fadeStart ? 0 : (t - fadeStart) / (1 - fadeStart);
            textAnimationOrder.forEach((item, i) => {
              const slotStart = i / textAnimationOrder.length;
              const slotEnd = (i + 1) / textAnimationOrder.length;
              const segT = gsap.utils.mapRange(slotStart, slotEnd, 0, 1, fadeProgress);
              gsap.set(item.segment, { opacity: Math.max(0, Math.min(1, segT)) });
            });

            // (Reverted) End fade-out of duplicate icons removed per user request.
          }
        }
      });

  // Force a refresh once layout settles to ensure measurements are correct
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
        trigger.kill();
        if (window.duplicateIcons) {
          window.duplicateIcons.forEach(d => d.remove());
          window.duplicateIcons = null;
        }
      };
    }, []);

  return (
    <>
    <section id="hero-section" className='flex flex-col w-screen h-svh items-center justify-center transition-colors duration-300'>
      <div id="hero-header" className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col text-center gap-4 will-change-transform flex-nowrap text-nowrap">
                <h1 className="text-6xl sm:text-9xl font-bold">ANON DMs</h1>
                <p className="text-lg">Share your thoughts anonymously</p>
        </div>

        {/* IMAGES */}
        <div id="images" className='fixed bottom-0 left-0 flex flex-row w-screen flex-nowrap items-end justify-center gap-2 pb-4' style={{ overflow: 'hidden' }}>

      <div className="relative flex-shrink-0 w-[min(200px,20vw)] h-[min(200px,20vw)]">
              <Image
                src="/img1.png"
                alt="Hero Image 1"
                fill
        sizes="(min-width:1024px) 200px, 20vw"
                className="object-cover"
              />
            </div>

      <div className="relative flex-shrink-0 w-[min(200px,20vw)] h-[min(200px,20vw)]">
              <Image
                src="/img2.jpg"
                alt="Hero Image 2"
                fill
        sizes="(min-width:1024px) 200px, 20vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

      <div className="relative flex-shrink-0 w-[min(200px,20vw)] h-[min(200px,20vw)]">
              <Image
                src="/img3.png"
                alt="Hero Image 3"
                fill
        sizes="(min-width:1024px) 200px, 20vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

      <div className="relative flex-shrink-0 w-[min(200px,20vw)] h-[min(200px,20vw)]">
              <Image
                src="/img4.png"
                alt="Hero Image 4"
                fill
        sizes="(min-width:1024px) 200px, 20vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

      <div className="relative flex-shrink-0 w-[min(200px,20vw)] h-[min(200px,20vw)]">
              <Image
                src="/img5.png"
                alt="Hero Image 5"
                fill
        sizes="(min-width:1024px) 200px, 20vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

        </div>


        {/* ANIMATED TEXT */}
                <h1 id="animated-text" className='relative text-center text-cyan-700 leading-1'>
            <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform invisible"></div>
            <span className="dynamic-text text-4xl opacity-0">Whispers travel farther than names.</span>
            <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform invisible"></div>
            <span className="dynamic-text text-4xl opacity-0">Secrets feel lighter when shared.</span>
            <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform invisible"></div>
            <span className="dynamic-text text-4xl opacity-0">Silence breaks—identity stays hidden.</span>
            <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform invisible"></div>
            <span className="dynamic-text text-4xl opacity-0">Anonymous voices still carry truth.</span>
            <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform invisible"></div>
            <span className="dynamic-text text-4xl opacity-0">Your thoughts. No spotlight. Just expression.</span>
        </h1>

    </section>
    <section id="outro" className='h-svh'>
      <h2 className="text-4xl font-bold text-center">Join the Conversation</h2>
      <p className="text-lg text-center">Share your thoughts anonymously and connect with others.</p>
    </section>
    </>
  )
}
