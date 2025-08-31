"use client"

import { Button } from "@/components/ui/button"
import Navigation from "@/utils/Navigation"
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { User } from 'next-auth';
import { animatePageIn } from "@/utils/animation";
import { motion } from 'motion/react';
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";



function DashNavbar() {
    const { data: session } = useSession();
    const user:User = session?.user as User;
    const deleteAll = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-all-messages/`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  return (
    <div className="sticky top-0 left-0 right-0 z-50 grid grid-cols-3 justify-center place-items-center px-2 py-2 bg-transparent backdrop-blur-3xl rounded-3xl">
              <div className="flex flex-col md:block justify-self-start justify-start items-start gap-2">
              
              <Button variant="outline" className="bg-cyan-400 rounded-2xl ml-auto hover:bg-white mr-2 sm:text-nowrap text-wrap">
                <Navigation href="/" label="Home" className="" />
              </Button>


<AlertDialog>
  <AlertDialogTrigger className="inline-flex items-center p-2 border rounded-2xl scale-80 bg-cyan-400 hover:bg-red-400 hover:rounded-t-2xl hover:border hover:rounded-br-2xl hover:scale-100 duration-200 ">
    <p className="text-black mr-2">Delete All</p>
    <Trash2 className="text-black w-5 h-5" />
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>

      <AlertDialogTitle>Do you want to Delete All the DMs?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete all the messages you have received.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={deleteAll}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>



              
            </div>

              {/* REPLACE WITH URL COPY BUTTON */}
            <h1
              className="text-center font-semibold bg-cyan-400 rounded-2xl w-fit mx-auto p-2 outline-1 cursor-pointer hover:scale-120 active:scale-120"
              onClick={() => {
                if (user?.id) {
                  navigator.clipboard.writeText(`http://localhost:3000/u/${user.username}`);
                  toast.success("Link copied successfully")
                }
              }}
            >
              Your Anon Messages link!
            </h1>


            {/* REPLACE WITH ACCEPT MESSAGES TOGGLE BUTTON */}
            <div className="flex flex-col md:block justify-self-end justify-end items-end gap-2">
              
              <Button variant="outline" className="justify-center bg-cyan-400 rounded-2xl ml-auto hover:bg-blue-400 mr-2 sm:text-nowrap text-wrap cursor-pointer">
                Accept DMs
              </Button>

              <Button 
                variant="outline" 
                className="justify-self-end bg-cyan-400 rounded-2xl hover:bg-red-400 active:bg-red-400 ml-2 mr-2 mt-1 md:mt-0 cursor-pointer hover:scale-110 hover:font-bold"
                onClick={ () => signOut({ callbackUrl: '/' }) }>
                <span className="font-medium">Logout</span>
              </Button>
            </div>
        </div>
  )
}

export default DashNavbar
