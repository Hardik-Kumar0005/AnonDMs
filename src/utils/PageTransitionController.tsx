// animatePageOut() bricking animation so this file fixes the issue meow!

"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { animatePageIn } from '@/utils/animation';

// Only triggers after nav
export default function PageTransitionController() {
  const pathname = usePathname();
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    animatePageIn();
  }, [pathname]);

  return null;
}
