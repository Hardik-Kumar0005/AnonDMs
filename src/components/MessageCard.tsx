"use client"

import React from 'react'
import { Message } from "@prisma/client";
import { BadgeX } from "lucide-react";

interface Props{
  message: Message;
}

function MessageCard( {message}: Props) {
  
  return (
    <div className='relative bg-cyan-200 rounded-2xl border shadow-md md:hover:scale-110 hover:scale-105 hover:z-100 hover:border-4 hover:border-amber-400 transition-transform duration-200 ease-in-out min-h-[120px] max-w-xl w-full flex flex-col justify-between max-h-fit overflow-y-auto'>
      <div className='grid grid-cols-1 place-items-center justify-center text-center mt-8 mx-4 break-words'>
        <h2 className="relative text-lg font-semibold self-center text-center whitespace-pre-line items-center">{message.content}
          <br />
        </h2>
      </div>
      <span className="text-sm text-gray-500 justify-center place-items-end text-center mt-4 mb-2 mx-4">{message.createdAt.toString()}</span>
      <BadgeX
        fill="yellow"
        className="absolute top-2 right-2" />
    </div>
  )
}

export default MessageCard
