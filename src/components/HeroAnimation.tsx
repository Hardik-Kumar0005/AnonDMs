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
    const hero = document.getElementById("hero-section");
    const header = document.getElementById("hero-header");
    const dynamicText = document.getElementById("dynamic-text");
    const placeholderIcon = document.getElementById("placeholder-icon");
    const images = document.getElementById("images");
    const imagesArray = images ? Array.from(images.children) : [];


const textSegments = document.querySelectorAll<HTMLElement>("#dynamic-text");
const textAnimationOrder: { segment: HTMLElement; originalIndex: number }[] = [];
const tweens: gsap.core.Tween[] = [];

// push all text segments with their index
textSegments.forEach((segment, index) => textAnimationOrder.push({ segment, originalIndex: index }));

// shuffle order randomly
for (let i = textAnimationOrder.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [textAnimationOrder[i], textAnimationOrder[j]] = [textAnimationOrder[j], textAnimationOrder[i]];
}

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const headerIconSize = isMobile ? 30 : 60;
const currentIconSize = imagesArray[0]?.getBoundingClientRect().width || 0;
const exactScale = headerIconSize / currentIconSize
ScrollTrigger.create({
    trigger: ".hero-section",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    scrub: 1,
    pin: true,
    pinSpacing: true,

    onUpdate: (self) => {
        const progress = self.progress;
        // Update the scale of the header icon based on scroll progress
        textSegments.forEach((segment) => {
            gsap.set(segment, { opacity: 0 });
        });

        let containerMoveY = 0;
        let moveProgress = 0;

        if (progress <= 0.3) {
            moveProgress = progress / 0.3;
            containerMoveY = -window.innerHeight * moveProgress * 0.3; // move up to half viewport height

            if (progress <= 0.15) {
                const headerProgress = progress / 0.15;
                const headerMoveY = -50 * headerProgress;
                const headerOpacity = 1 - headerProgress;

                gsap.set(header, {
                    transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`, opacity: headerOpacity
                });
            }
            else {
                gsap.set(header, { transform: `translate(-50%, calc(-50% + -50px))`, opacity: 0 });
            }
            if (window.duplicateIcons) {
                window.duplicateIcons.forEach((duplicate) => {
                    if (duplicate.parentNode) {
                        duplicate.parentNode.removeChild(duplicate);
                    }
                });
    
                window.duplicateIcons = null;
            }
    
            gsap.set(imagesArray, {
                x: 0,
                y: containerMoveY,
                scale: 1,
                opacity: 1,
            });
    
            imagesArray.forEach((image, index) => {
                const staggerDelay = index * 0.1;
                const imageStart = staggerDelay;
                const imageEnd = staggerDelay + 0.5;
    
                const imageProgress = gsap.utils.mapRange(imageStart, imageEnd, 0, 1, moveProgress);
    
                const clampedProgress = Math.max(0, Math.min(1, imageProgress));
    
                const startOffset = -containerMoveY;
                const individualY = startOffset * (1 - clampedProgress);
    
                gsap.set(image, { 
                    x: 0,
                    y: individualY,
                  });
            });
        }

        else if(progress <= 0.6){
            const scaleProgress = (progress - 0.3) / 0.3;
            gsap.set(header, {
                transform: `translate(-50%, calc(-50% + -50px))`,
                opacity: 0,
            });

            if (scaleProgress >= 0.5 && hero) {
                hero.style.backgroundColor = "red";
            }
            else if (hero){
                hero.style.backgroundColor = "green";
            }

            if (window.duplicateIcons) {
                window.duplicateIcons.forEach((duplicate) => {
                    if (duplicate.parentNode) {
                        duplicate.parentNode.removeChild(duplicate);
                    }
                });

                window.duplicateIcons = null;
            }

            const targetCenterY = window.innerHeight / 2;
            const targetCenterX = window.innerWidth / 2;
            const containerRect = images?.getBoundingClientRect();
            if (containerRect) {
                const currentCenterX = containerRect.left + containerRect.width / 2;
                const currentCenterY = containerRect.top + containerRect.height / 2;
            }
            const deltaY = targetCenterY - (containerRect?.top || 0) - (containerRect?.height || 0) / 2;
            const deltaX = targetCenterX - (containerRect?.left || 0) - (containerRect?.width || 0) / 2;

        }

    }
});

// fade in each segment one by one
textAnimationOrder.forEach((item, i) => {
  const t = gsap.fromTo(item.segment, { opacity: 0 }, { opacity: 1, duration: 1, delay: i * 0.5 });
  tweens.push(t);
});



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
            <div id="placeholder-icon" className='-mt-10 w-15 h-15 inline-block align-middle will-change-transform invisible'></div>
            <span id="dynamic-text" className='text-4xl opacity-0'>I am Beauty. Beauty is me.</span>
        </h1>

    </section>
    </>
  )
}
