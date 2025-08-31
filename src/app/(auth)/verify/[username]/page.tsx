"use client";

import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/schemas/verifySchema';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
// Using system serif (Times New Roman) instead of Google-hosted Single Day
import Link from 'next/link';
import Navigation from '@/utils/Navigation';



function page() {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try{
            const response = await axios.post(`/api/verify-code`, { 
                username: params.username,
                code: data.code
             });
             toast.success("Verification successful");
                router.replace(`signin`);
        }
        catch(error){
            console.error("Error verifying code:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Verification failed");

        }
    }


  return (
    <>
    <div className='flex justify-center items-center min-h-screen bg-cyan-800/60'>
      <div className='w-full max-w-md md:p-8 p-4 space-y-8 bg-transparent rounded-lg'>
        <div className='text-center'>
          <div className="inline-block rounded-full shadow-lg px-8 py-4 mb-6 border-2 border-black">
            <h1 className={`text-5xl font-extrabold tracking-tight lg:text-6xl text-gray-800 font-serif`} style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              Verify Account
            </h1>
          </div>
          <p className='mb-4'>Enter the verification code sent to <span className='font-bold'>{params.username}</span></p>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 flex flex-col w-full'>
            <FormField
              name='code'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <input {...field} placeholder='123456' className='w-full px-3 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full flex justify-center items-center hover:scale-105 transform duration-200 hover:text-green-400 mt-2'>
              Verify
            </Button>
          </form>
        </Form>

        <div className='text-center mt-6'>
          <p className={`text-gray-600 text-lg font-serif`} style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            Need a new code?{' '}
          </p>
          <div className='flex justify-center place-items-center mt-3'>
            <Navigation href='/signup' label = "Resend Code" className='w-fit text-2xl font-bold text-blue-700 hover:text-amber-400 hover:bg-cyan-700 hover:scale-110 duration-300 rounded-4xl p-2' />
          </div>
        </div>

      </div>
    </div>
    </>
  );
}

export default page;
