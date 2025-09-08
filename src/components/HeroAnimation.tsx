"use client";

import React from 'react'
import Image from 'next/image'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Lenis from 'lenis';
import { Comic_Relief } from 'next/font/google';
import { Weight } from 'lucide-react';
import { Button } from './ui/button';
import Navigation from '@/utils/Navigation';

const comicRelief = Comic_Relief({weight: ["700"]});

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
        
        lenis.on('scroll', ScrollTrigger.update);
        
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        
        gsap.ticker.lagSmoothing(0);
    },[])


    React.useEffect(() => {
      const hero = document.getElementById("hero-section");
      const header = document.getElementById("hero-header");
      const images = document.getElementById("images");
      if (!hero || !header || !images) return;

      // Set initial background class
      document.body.classList.add('bg-hero');

      // Measure navbar (assumes a <nav> element exists in layout)
      const navEl = document.querySelector('nav');
      const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;

      // Mobile detection early
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      // Always offset hero for navbar so animated elements don't pass underneath
      hero.style.minHeight = `calc(100vh - ${navHeight}px)`;
      hero.style.height = `calc(100vh - ${navHeight}px)`;
      hero.style.paddingTop = `${navHeight}px`;

      const imagesArray = Array.from(images.children) as HTMLElement[];

      // Mobile: constrain initial row so all images fit inside viewport width
      if (isMobile) {
        const count = images.children.length;
        const sidePadPx = 12; // left/right breathing room
        const gapPx = 4; // tight gap
        const available = window.innerWidth - sidePadPx * 2;
        const widthEach = Math.floor((available - gapPx * (count - 1)) / count);
        imagesArray.forEach(wrapper => {
          wrapper.style.width = `${widthEach}px`;
          wrapper.style.height = `${widthEach}px`;
        });
        Object.assign(images.style, {
          paddingLeft: `${sidePadPx}px`,
          paddingRight: `${sidePadPx}px`,
          gap: `${gapPx}px`
        });
      }

  const textSegments = document.querySelectorAll<HTMLElement>(".dynamic-text");
  const placeholderIcons = document.querySelectorAll<HTMLElement>(".placeholder-icon"); 
  const textContainer = textSegments[0]?.parentElement;
      const headerIconSize = isMobile ? 45 : 90;
      
      if (textContainer) {
        // Make container cover hero for absolute positioning of top/bottom groups.
        gsap.set(textContainer, {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          transform: 'none',
          pointerEvents: 'none'
        });
      }

      // We'll leave original text structure; later we'll absolutely position around center image.
      const STAGE_1_END = 0.35; // header up + rise
      const STAGE_2_END = 0.6;  // morph duplicates (prep)

      // state for final layout
      let layoutInitialized = false;
      let textLayoutDone = false;
      const imageFinalTargets: {left:number; top:number; scale:number;}[] = [];

      function initFinalLayout(centerIndex = 2) {
        if (layoutInitialized || !window.duplicateIcons) return;
  if (!hero) return; // safety
  const heroRect = hero.getBoundingClientRect();
  const pad = 24;
  const sidePad = isMobile ? 12 : pad; // tighter side padding on small screens
        const dups = window.duplicateIcons;
        if (!dups || dups.length < 5) return;
        // map indices: 0 TL,1 TR,2 center,3 BL,4 BR
        const extraTopMargin = isMobile ? 32 : 64; // pushes images further down
        dups.forEach((dup, i) => {
          let w = dup.getBoundingClientRect().width;
          let h = dup.getBoundingClientRect().height;
          const centerScaleDesktop = 1.3;
          const centerScaleMobile = 1.05;
          let left = 0, top = 0, scale = i === centerIndex ? (isMobile ? centerScaleMobile : centerScaleDesktop) : 1;
          const topOffset = pad + navHeight + extraTopMargin; // lower the top row below nav + extra spacing
          // Adjust scale so width never exceeds viewport width minus sidePad margins
          if (isMobile) {
            const maxAvail = heroRect.width - 2 * sidePad;
            if (w * scale > maxAvail) {
              scale = maxAvail / w;
            }
          }
          if (i === centerIndex) {
            // center but never above a safe band
            left = (heroRect.width - w * scale) / 2;
            const idealCenterTop = (heroRect.height - h * scale) / 2;
            // ensure center isn't too high; clamp to at least (topOffset + 20)
            top = Math.max(idealCenterTop, topOffset + 20);
            // also prevent bottom overflow
            const maxTop = heroRect.height - h * scale - pad;
            top = Math.min(top, maxTop);
          } else {
            switch(i) {
              case 0: left = sidePad; top = topOffset; break; // TL
              case 1: left = heroRect.width - w * scale - sidePad; top = topOffset; break; // TR
              case 3: left = sidePad; top = heroRect.height - h * scale - pad; break; // BL
              case 4: left = heroRect.width - w * scale - sidePad; top = heroRect.height - h * scale - pad; break; // BR
            }
          }
          // Clamp horizontally in case scale pushes outside
          const maxLeft = heroRect.width - w * scale - sidePad;
          left = Math.min(Math.max(left, sidePad), maxLeft);
          // Prevent overlap with navbar (mobile) for non-bottom rows
          if (top < topOffset) top = topOffset;
          imageFinalTargets[i] = { left, top, scale };
        });
        layoutInitialized = true;
      }

  function applyTextLayout() {
    if (textLayoutDone) return;
    if (!hero || !textContainer) return;
    const heroRect = hero.getBoundingClientRect();
    const centerDup = window.duplicateIcons?.[2];
    if (!centerDup) return; // wait until center image exists
    const centerRect = centerDup.getBoundingClientRect();
    const centerTopLocal = centerRect.top - heroRect.top;
    const centerBottomLocal = centerRect.bottom - heroRect.top;

    // Create top & bottom group wrappers
    let topGroup = document.getElementById('dynamic-text-top');
    let bottomGroup = document.getElementById('dynamic-text-bottom');
    if (!topGroup) {
      topGroup = document.createElement('div');
      topGroup.id = 'dynamic-text-top';
      textContainer.appendChild(topGroup);
    }
    if (!bottomGroup) {
      bottomGroup = document.createElement('div');
      bottomGroup.id = 'dynamic-text-bottom';
      textContainer.appendChild(bottomGroup);
    }
    // Reset groups
    topGroup.innerHTML = '';
    bottomGroup.innerHTML = '';

    const gap = (window.matchMedia('(max-width: 768px)').matches) ? 4 : 14;

    // Assign first 2 to top, remaining to bottom
    textSegments.forEach((seg, i) => {
      // Allow wrapping on mobile for better text flow
      seg.style.whiteSpace = isMobile ? 'normal' : 'nowrap';
      seg.style.display = 'inline-block';
      seg.style.marginRight = i === 1 || i === textSegments.length-1 ? '0' : `${gap}px`;
      seg.style.maxWidth = isMobile ? '100%' : 'none';
      seg.style.wordBreak = isMobile ? 'break-word' : 'normal';
      if (i < 2) topGroup!.appendChild(seg); else bottomGroup!.appendChild(seg);
    });

    // Style groups (inline items; wrap if overflow) and position
    const maxWidthPercent = isMobile ? '95%' : '90%';
    [topGroup, bottomGroup].forEach(g => {
      if (!g) return;
      Object.assign(g.style, {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${gap}px`,
        maxWidth: maxWidthPercent,
        pointerEvents: 'none',
        textAlign: 'center'
      });
    });

    // Positioning logic:
    // Desktop: balanced centering in available space above/below center image.
    // Mobile (narrow): hug closer to the image (minimal spacing) so text stays near focal point.
    const minSpacingDesktop = 20;
    const minSpacingMobile = 6; // much tighter for small screens

    // Measure intrinsic heights first
    topGroup!.style.top = '0px';
    bottomGroup!.style.top = '0px';
    const topH = topGroup!.getBoundingClientRect().height;
    const bottomH = bottomGroup!.getBoundingClientRect().height;

    let topY: number;
    let bottomY: number;

    if (isMobile) {
      // Compact: place directly above and below with tight spacing
      topY = Math.max(centerTopLocal - topH - minSpacingMobile, 0);
      bottomY = Math.min(centerBottomLocal + minSpacingMobile, heroRect.height - bottomH);
      // If overlapping due to extremely small space, fallback to slight overlap avoidance
      if (bottomY - (topY + topH) < (centerBottomLocal - centerTopLocal)) {
        // leave as is; primary goal is proximity
      }
    } else {
      // Desktop balanced approach
      const spaceAbove = centerTopLocal;
      const spaceBelow = heroRect.height - centerBottomLocal;
      topY = (spaceAbove - topH) / 2;
      bottomY = centerBottomLocal + (spaceBelow - bottomH) / 2;
      // enforce minimum spacing
      if (centerTopLocal - (topY + topH) < minSpacingDesktop) {
        topY = Math.max(centerTopLocal - topH - minSpacingDesktop, 0);
      }
      if (bottomY - centerBottomLocal < minSpacingDesktop) {
        bottomY = Math.min(centerBottomLocal + minSpacingDesktop, heroRect.height - bottomH);
      }
      // Additional downward shift to bring first two (top group) closer to center image on desktop only
      const desktopTopGroupShift = 60; // px; adjust as desired
      const maxTopBeforeOverlap = centerTopLocal - topH - minSpacingDesktop; // largest allowed top position without violating spacing
      // Only shift if there is room (topY less than allowed max position)
      if (topY < maxTopBeforeOverlap) {
        topY = Math.min(topY + desktopTopGroupShift, Math.max(0, maxTopBeforeOverlap));
      }
    }

  // Nudge bottom group further down to avoid any visual clipping under the center image
  const extraBottomOffset = isMobile ? 140 : 14; // further increased mobile shift per request
  bottomY = Math.min(bottomY + extraBottomOffset, heroRect.height - bottomH);

    // Final clamps
    topY = Math.max(0, Math.min(topY, heroRect.height - topH));
    bottomY = Math.max(0, Math.min(bottomY, heroRect.height - bottomH));

    topGroup!.style.top = `${topY}px`;
    bottomGroup!.style.top = `${bottomY}px`;

    textLayoutDone = true;
  }

      // Build randomized text reveal order
      const textAnimationOrder: { segment: HTMLElement; originalIndex: number }[] = [];
      textSegments.forEach((segment, index) => {
        textAnimationOrder.push({ segment, originalIndex: index });
        gsap.set(segment, { opacity: 0 });
      });
      for (let i = textAnimationOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [textAnimationOrder[i], textAnimationOrder[j]] = [textAnimationOrder[j], textAnimationOrder[i]];
      }

      const trigger = ScrollTrigger.create({
        trigger: "#hero-section",
        start: "top top",
        end: `+=${window.innerHeight * 6}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        // markers: true,
        onUpdate: (self) => {
          const p = self.progress;

          if (p <= STAGE_1_END) {
            const t = p / STAGE_1_END;
            const headerMoveY = -100 * t;
            gsap.set(header, { transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`, opacity: 1 - t });

            if (window.duplicateIcons) {
              window.duplicateIcons.forEach(d => d.remove());
              window.duplicateIcons = null;
            }
            const riseDistance = window.innerHeight * 0.45;
            gsap.set(images, { y: -riseDistance * t, opacity: 1 });
            
            textSegments.forEach(segment => gsap.set(segment, { opacity: 0 }));

          }
          else if (p <= STAGE_2_END) {
            const t = (p - STAGE_1_END) / (STAGE_2_END - STAGE_1_END);
            gsap.set(header, { opacity: 0 });

            if (!window.duplicateIcons) {
              window.duplicateIcons = [];
              const heroRect = hero.getBoundingClientRect();
              imagesArray.forEach(image => {
                const rect = image.getBoundingClientRect();
                const duplicate = image.cloneNode(true) as HTMLElement;
                duplicate.className = "duplicate";
                const relLeft = rect.left - heroRect.left;
                const relTop = rect.top - heroRect.top;
                Object.assign(duplicate.style, {
                  position: 'absolute',
                  left: `${relLeft}px`,
                  top: `${relTop}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`,
                  zIndex: '100',
                  willChange: 'transform,left,top'
                });
                duplicate.dataset.startLeft = `${relLeft}`;
                duplicate.dataset.startTop = `${relTop}`;
                duplicate.dataset.startWidth = `${rect.width}`;
                hero.appendChild(duplicate);
                window.duplicateIcons!.push(duplicate);
              });
              initFinalLayout();
            }

            gsap.set(images, { opacity: 0 });

            if (window.duplicateIcons) {
              window.duplicateIcons.forEach((dup) => {
                const startWidth = parseFloat(dup.dataset.startWidth!);
                const currentScale = gsap.utils.interpolate(1, 1.05, t);
                gsap.set(dup, { transform: `scale(${currentScale})` });
              });
            }
          }
          else {
            gsap.set(header, { opacity: 0 });
            if (!window.duplicateIcons) return;
            // FINAL STAGE: animate images to corners + center
            const finalProg = (p - STAGE_2_END) / (1 - STAGE_2_END); // 0..1
            initFinalLayout();
            window.duplicateIcons.forEach((dup, i) => {
              const startLeft = parseFloat(dup.dataset.startLeft!);
              const startTop = parseFloat(dup.dataset.startTop!);
              const target = imageFinalTargets[i];
              if (!target) return;
              const curLeft = gsap.utils.interpolate(startLeft, target.left, finalProg);
              const curTop = gsap.utils.interpolate(startTop, target.top, finalProg);
              const curScale = gsap.utils.interpolate(isMobile ? 1.02 : 1.05, target.scale, finalProg);
              gsap.set(dup, { left: `${curLeft}px`, top: `${curTop}px`, transform: `scale(${curScale})` });
            });
            // reveal and place text around center once (after small threshold)
            if (finalProg > 0.05) {
              applyTextLayout();
              const textReveal = (finalProg - 0.05) / 0.95; // 0..1
              textAnimationOrder.forEach((item, idx) => {
                const step = idx / textAnimationOrder.length;
                const local = (textReveal - step) * textAnimationOrder.length;
                const o = gsap.utils.clamp(0,1, local);
                gsap.set(item.segment, { opacity: o });
              });
            }
          }
        }
      });
      // Resize handler to re-flow text groups after center image changes size/viewport
      const handleResize = () => {
        // Only attempt after duplicates (final stage) exist
        if (!window.duplicateIcons) return;
        // allow re-layout next time applyTextLayout runs
        textLayoutDone = false;
        applyTextLayout();
      };
      window.addEventListener('resize', handleResize);
      
      // Background swap when outro enters viewport (after pinned hero)
      const outro = document.getElementById('outro');
      if (outro) {
        ScrollTrigger.create({
          trigger: outro,
          start: 'top center',
          onEnter: () => { document.body.classList.remove('bg-hero'); document.body.classList.add('bg-outro'); },
          onLeaveBack: () => { document.body.classList.remove('bg-outro'); document.body.classList.add('bg-hero'); }
        });
      }

      return () => {
        trigger.kill();
        if (window.duplicateIcons) {
          window.duplicateIcons.forEach(d => d.remove());
          window.duplicateIcons = null;
        }
        window.removeEventListener('resize', handleResize);
        document.body.classList.remove('bg-hero','bg-outro');
      }
  },[]);


  return (
    <>
    <section id="hero-section" className='relative flex flex-col w-screen h-lvh overflow-hidden items-center justify-center transition-colors duration-300'>
      <div id="hero-header" className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col text-center gap-4 will-change-transform flex-nowrap text-nowrap">
                <h1 className={`text-6xl sm:text-9xl font-bold text-shadow-red-500 ${comicRelief.className}`}>ANON DMs</h1>
                <p className={`text-lg ${comicRelief.className}`}>Share your thoughts anonymously</p>
        </div>

        {/* IMAGES */}
  <div id="images" className='absolute bottom-1/12 left-1/2 -translate-x-1/2 flex flex-row w-screen flex-nowrap items-end justify-center gap-2 pb-2' style={{ overflow: 'hidden' }}>

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
                src="/img2.png"
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
        <h1 id="animated-text" className='relative text-center text-black font-extrabold leading-1'>
      {/* Reordered so each placeholder (image target) appears AFTER its text segment */}
  <span className="dynamic-text text-xs sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-0 mr-2 inline-block leading-tight">Whispers travel farther than names.</span>
      <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform mx-1 invisible"></div>

  <span className="dynamic-text text-xs sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-0 mr-2 inline-block leading-tight">Secrets feel lighter when shared.</span>
      <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform mx-1 invisible"></div>

  <span className="dynamic-text text-xs sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-0 mr-2 inline-block leading-tight">Silence breaks—identity stays hidden.</span>
      <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform mx-1 invisible"></div>

  <span className="dynamic-text text-xs sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl opacity-0 mr-2 inline-block leading-tight">Anonymous voices still carry truth.</span>
      <div className="placeholder-icon -mt-10 w-15 h-15 inline-block align-middle will-change-transform mx-1 invisible"></div>

    </h1>

    </section>
    <section id="outro" className='h-svh min-h-screen flex flex-col items-center justify-center px-6 text-center gap-4'>
      <h2 className="text-4xl sm:text-5xl font-bold">Join the Conversation</h2>
      <p className="text-lg max-w-2xl">Share your thoughts anonymously and connect with others.</p>
      <div>
        <Button size="lg" className="mt-12 bg-black hover:bg-cyan-700 hover:text-black text-white font-semibold transition-colors duration-300">
          <Navigation href='/signup' label="Get Started" className='' />
        </Button>
      </div>
    </section>
    </>
  )
}
