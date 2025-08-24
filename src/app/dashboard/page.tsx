import React from 'react'
import Navbar from './Navbar'
import Image from 'next/image'

function page() {
  return (
    <>
      <Navbar />
      <div className='fixed left-1/2 transform -translate-x-1/2'>
        <Image draggable="false" style={{ 
            pointerEvents: 'none',
            userSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
         }}
          src="/dashArrow.png" alt="Description" width={300} height={300} />
      </div>
      <div className='w-screen h-screen flex p-4 justify-center items-center'>
        DASHBOARD
      </div>
    </>
  )
}

export default page
