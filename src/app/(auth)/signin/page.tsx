"use client";

import React from 'react'
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';

function page() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {


    try{
      const response = await axios.post<ApiResponse>("/api/signin", {
        identifier: data.identifier,
        password: data.password
      });
      toast.success(response.data.message);
      router.replace(`/`);
    }
    catch(error){
      console.error("Error signing in:", error);
      toast.error("Failed to sign in");
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Anon DMs
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;