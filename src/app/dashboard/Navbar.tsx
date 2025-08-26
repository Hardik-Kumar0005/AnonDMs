"use client"

import { Button } from "@/components/ui/button"
import Navigation from "@/utils/Navigation"
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { User } from 'next-auth';
import { animatePageIn } from "@/utils/animation";
import { motion } from 'motion/react';



function Navbar() {
    const { data: session } = useSession();
    const user:User = session?.user as User;

  return (
    <div className="sticky top-0 left-0 right-0 z-50 grid grid-cols-3 items-center px-2 py-2 bg-transparent ">
              <Button variant="outline" className="justify-self-start mr-auto bg-cyan-400 rounded-2xl ml-2">
            <Navigation href="/" label="Home" className="" /> 

              </Button>

              {/* REPLACE WITH URL COPY BUTTON */}
            <h1 className="text-center font-semibold bg-cyan-400 rounded-2xl w-fit mx-auto p-2 outline-1">
              Copy your anonymous messages link!
            </h1>


            {/* REPLACE WITH ACCEPT MESSAGES TOGGLE BUTTON */}
            <div className="flex flex-col md:block justify-self-end justify-end items-end">
              <Button variant="outline" className="justify-self-end bg-cyan-400 rounded-2xl ml-auto hover:bg-blue-400 mr-2 sm:text-nowrap text-wrap">
                Accept DMs
              </Button>

              <Button 
                variant="outline" 
                className="justify-self-end bg-cyan-400 rounded-2xl ml-auto hover:bg-red-400 mr-2"
                onClick={ () => signOut({ callbackUrl: '/' }) }>
                <span className="font-medium">Logout</span>
              </Button>
            </div>
        </div>
  )
}

export default Navbar
