"use client"

import React, { useCallback } from 'react'
import Navbar from './Navbar'
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@prisma/client';
import { toast } from 'sonner';
import MessageCard from '@/components/MessageCard';

function page() {

  const { data: session } = useSession();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessage = watch("acceptMessages");

  const fetchMessages = useCallback( async ( refresh: boolean = false ) => {
    setIsButtonLoading(false);
    setLoading(true);
    try{
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);

      if(refresh) {
        toast.success("Messages refreshed");
      }

      if( setMessages.length === 0 ){
        // Handle empty messages case
      }
    }
    catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "An error occurred while fetching messages");
    }
    finally{
      setLoading(false);
      setIsButtonLoading(false);
    }
  }, [setLoading, setMessages, toast]);


React.useEffect(() => {
  if( !session || !session.user) {
    return;
  }

  fetchMessages();
}, [session, setValue, toast, fetchMessages]);


  return (
    <>

      <Navbar />
      <div className='fixed left-1/2 transform -translate-x-1/2'>
        <Image draggable="false" style={{
            pointerEvents: 'none',
            userSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
         }}
          src="/dashArrow.png" alt="Description" width={300} height={300} />
      </div>
      <div className='w-screen min-h-screen flex flex-col p-4 justify-center sm:justify-start sm:ml-auto sm:mr-auto sm:pt-48 items-center z-100 sm:mt-12 mt-8 overflow-x-auto max-w-fit '>
        DASHBOARD
        fetch messages and display here
        <br />

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-12 sm:w-full max-w-2xl max-h-1/2 sm:max-w-screen items-center justify-center'>
          {messages.map(message => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      </div>
        

      
    </>
  )
}

export default page
