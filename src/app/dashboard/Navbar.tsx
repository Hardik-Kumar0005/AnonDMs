"use client"

import { Button } from "@/components/ui/button"
import Navigation from "@/utils/Navigation"


function Navbar() {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 grid grid-cols-3 items-center px-4 py-2">
              <Button variant="outline" className="justify-self-start mr-auto bg-cyan-400 rounded-2xl">
            <Navigation href="/" label="Home" className="" /> 

              </Button>

              {/* REPLACE WITH URL COPY BUTTON */}
            <h1 className="text-center font-semibold bg-cyan-400 rounded-2xl w-fit mx-auto p-2 outline-1">DASH NAV</h1>


              <Button variant="outline" className="justify-self-end bg-cyan-400 rounded-2xl ml-auto">
                <Navigation href="/logout" label="Logout" className="" />
              </Button>
        </div>
  )
}

export default Navbar
