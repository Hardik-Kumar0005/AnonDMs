"use client";

import { animatePageIn } from '@/utils/animation';
import React from 'react'

function template({ children }: { children: React.ReactNode }) {

    React.useEffect(() => {
        animatePageIn();
    }, []);

  return (
    <div>
      <div id="b1" className='min-h-screen bg-white z-10 fixed top-0 left-0 w-full h-1/4`'>
      </div>

      <div id="b2" className='min-h-screen bg-white z-10 fixed top-1/4 left-0 w-full h-1/4'>
      </div>

      <div id="b3" className='min-h-screen bg-white z-10 fixed top-1/2 left-0 w-full h-1/4'>
      </div>

      <div id="b4" className='min-h-screen bg-white z-10 fixed top-3/4 left-0 w-full h-1/4'>
      </div>

      {children}
    </div>
  )
}

export default template;
