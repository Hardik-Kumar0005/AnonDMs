import PageTransitionController from '@/utils/PageTransitionController'
import Navigation from '@/utils/Navigation'
import React from 'react'
import { Button } from '@/components/ui/button'

function Navbar() {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 justify-center place-items-center px-2 border mt-2 mx-2 py-2 bg-transparent backdrop-blur-3xl rounded-3xl shadow">
                <div className="flex flex-col md:block justify-self-start items-start gap-2">
                    <Button className="bg-cyan-400 rounded-2xl px-3 py-1 text-black hover:bg-amber-400 hover:font-bold duration-300">
                    <Navigation href="/" label="Home" className="" />
                    </Button>
                </div>

                <h1 className="text-center text-2xl bg-cyan-400 rounded-2xl w-fit mx-auto py-1 px-4">Anon DMs</h1>

                <div className="flex flex-col md:block justify-self-end items-end gap-2">
                    <Button className="bg-cyan-400 rounded-2xl px-3 py-1 text-black hover:bg-amber-400 hover:font-bold duration-300">
                    <Navigation href="/signup" label="Sign up" className="" />
                    </Button>
                </div>
            </div>
            <PageTransitionController />
        </>
    )
}

export default Navbar
