"use client";
import React from 'react';
import { animatePageIn } from '@/utils/animation';

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
      <div id="b1" className="fixed inset-x-0 top-0 z-10 h-1/4 bg-white" />
      <div id="b2" className="fixed inset-x-0 top-1/4 z-10 h-1/4 bg-white flex items-center justify-center">
        <div className="text-6xl md:text-7xl font-semibold select-none">Anon</div>
      </div>
      <div id="b3" className="fixed inset-x-0 top-1/2 z-10 h-1/4 bg-white flex items-center justify-center">
        <div className="text-6xl md:text-7xl font-semibold select-none">DMs</div>
      </div>
      <div id="b4" className="fixed inset-x-0 top-3/4 z-10 h-1/4 bg-white" />
    </>
  );
};

export default IntroAnimation;
