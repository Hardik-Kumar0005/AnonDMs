"use client"

import React from 'react'
import { Message } from "@prisma/client";
import { BadgeX } from "lucide-react";
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
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';


interface Props{
  message: Message;
  deleteMessage?: (messageId: string) => void;
}

function MessageCard( {message, deleteMessage}: Props) {

  const handleDelete = async () => {
    if (!message.id) {
      return;
    };
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message.id}`);
      deleteMessage?.(message.id);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }


  return (
    <div className='relative bg-cyan-200 rounded-2xl border shadow-md md:hover:scale-105 hover:scale-105 hover:z-101 hover:border-4 hover:border-amber-400 active:border-amber-400 transition-transform duration-200 ease-in-out min-h-[120px] max-w-xl w-full flex flex-col justify-between max-h-fit overflow-y-auto'>
      <div className='grid grid-cols-1 place-items-center justify-center text-center mt-8 mx-4 break-words'>
        <h2 className="relative text-lg font-semibold self-center text-center whitespace-pre-line items-center">{message.content}
          <br />
        </h2>
      </div>
      <span className="text-sm text-gray-500 justify-center place-items-end text-center mt-4 mx-4">{message.createdAt.toString()}</span>
      

        <AlertDialog>
  <AlertDialogTrigger>

    <BadgeX
        fill="yellow"
        className="absolute top-2 right-2 scale-110 hover:scale-120 hover:bg-red-700 active:bg-red-700 hover:rounded-t-2xl hover:border hover:rounded-br-2xl" />

  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>
  )
}

export default MessageCard
