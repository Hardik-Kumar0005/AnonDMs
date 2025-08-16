import Navigation from '@/utils/Navigation'
import React from 'react'

function page() {
  return (
    <>
    <div>
      <Navigation href="/signin" label="Sign in" className='bg-green-500 rounded-2xl p-2'>
      <p>SIGN IN</p>
      </Navigation>
      
    </div>
    </>
  )
}

export default page
