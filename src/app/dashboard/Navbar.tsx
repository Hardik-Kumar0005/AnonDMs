"use client"

import { Button } from "@/components/ui/button"
import Navigation from "@/utils/Navigation"


function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow grid grid-cols-3 items-center px-4 py-2">
            <Navigation href="/" label="Home" className="justify-self-start border-amber-500 border-8 w-fit" />
            <h1 className="text-center font-semibold">DASH NAV</h1>
              <Button variant="outline" className="justify-self-end">Logout</Button>
        </div>
  )
}

export default Navbar
