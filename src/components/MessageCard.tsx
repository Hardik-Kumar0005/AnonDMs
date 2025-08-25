"use client"

import React from 'react'
import { Message } from "@prisma/client";

interface Props{
  message: Message;
}

function MessageCard( {message}: Props) {
  
  return (
      <div className='grid grid-cols-1 gap-4'>
        <h2 className="text-lg font-semibold">{message.content}</h2>
        <p className="text-sm text-gray-500">{message.createdAt.toString()}</p>
      </div>
  )
}

export default MessageCard
