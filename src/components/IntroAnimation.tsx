"use client";
import React from 'react';
import { animatePageIn } from '@/utils/animation';
import { DynaPuff } from 'next/font/google';

const dynaPuff = DynaPuff({ subsets: ['latin'] });

/**
 * Client-only overlay banners + entrance animation.
 * Keeps server-rendered HTML stable (avoids hydration mismatches) by
 * rendering empty placeholders first, then animating after mount.
 */

const IntroAnimation: React.FC = () => {
  React.useEffect(() => {
    animatePageIn();
  }, []);

  return (
    <>
      <div
        id="b1"
        className="fixed inset-x-0 top-0 z-10 h-1/4 bg-amber-400 border-8 border-black rounded-br-4xl"
        style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      />
      <div
        id="b2"
        className="fixed inset-x-0 top-1/4 z-10 h-1/4 bg-cyan-500 flex items-center justify-center border-8 border-black rounded-r-4xl"
        style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        <div className={`${dynaPuff.className} text-7xl md:text-9xl font-semibold select-none`}>Anon</div>
      </div>
      <div
        id="b3"
        className="fixed inset-x-0 top-1/2 z-10 h-1/4 bg-cyan-500 flex items-center justify-center border-8 border-black rounded-r-4xl"
        style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        <div className={`${dynaPuff.className} text-7xl md:text-9xl font-semibold select-none`}>DMs</div>
      </div>
      <div
        id="b4"
        className="fixed inset-x-0 top-3/4 z-10 h-1/4 bg-amber-400 border-8 border-black rounded-tr-4xl"
        style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      />
    </>
  );
};

export default IntroAnimation;
