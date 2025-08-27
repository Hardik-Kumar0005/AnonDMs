"use client"

import React from 'react'
import { Message } from "@prisma/client";
import { BadgeX } from "lucide-react";

interface Props{
  message: Message;
}

function MessageCard( {message}: Props) {
  
  return (
    <div className='relative bg-cyan-200 rounded-2xl border shadow-md hover:scale-105 hover:border-4 hover:border-amber-400 transition-transform duration-200 ease-in-out'>
      <div className='grid grid-cols-1 place-items-center justify-center text-center p-8'>
        <h2 className="text-lg font-semibold self-center text-center">{message.content}
          <br />
        <span className="text-sm text-gray-500">{message.createdAt.toString()}</span>
        </h2>

      </div>
        <BadgeX className="absolute top-2 right-2" />
    </div>
  )
}

export default MessageCard
