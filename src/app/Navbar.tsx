import PageTransitionController from '@/components/PageTransitionController'
import Navigation from '@/utils/Navigation'
import React from 'react'

function Navbar() {
return (
    <>
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow grid grid-cols-3 items-center px-4 py-2">
            <Navigation href="/" label="Home" className="justify-self-start border-amber-500 border-8 w-fit" />
            <h1 className="text-center font-semibold">LAND NAV</h1>
            <Navigation href="/signup" label="Sign up" className="justify-self-end border-amber-500 border-8 w-fit" />
        </div>
        <PageTransitionController />
    </>
)
  
}

export default Navbar
