"use client"

import React, { Suspense } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Single_Day } from 'next/font/google';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import Navigation from '@/utils/Navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

const singleDay = Single_Day({ weight: '400' });

function page() {
  const [ username, setUsername ] = React.useState("");
  const [usernameMessage, setUsernameMessage] = React.useState("");
  const [ loading, setLoading ] = React.useState(false);
  const [ isSubmitting, setIsSubmitting ] = React.useState(false);
  const [debouncedUsername] = useDebounceValue(username, 300);
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setLoading(true);
        setUsernameMessage("");
        try{
          const response = await axios.get(`/api/check-username?username=${debouncedUsername}`);
          console.log (response);
          setUsernameMessage(response.data.message);
        }
        catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
              setUsernameMessage("Username is already taken");
            } else {
              setUsernameMessage(error.response?.data.message || "An error occurred while checking username");
            }
          }
        }
        finally{
          setLoading(false);
        }
      };
    }
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/signup', data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);

    }
    catch(error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message || "An error occurred while signing up";
      toast.error(errorMessage);
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <div className='flex justify-center items-center min-h-screen bg-cyan-800/60'>
      <div className='w-full max-w-md md:p-8 p-4 space-y-8 bg-transparent rounded-lg'>
        <div className='text-center'>
            <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-block rounded-full shadow-lg px-8 py-4 mb-6 border-2 border-black">
            <h1 className={`text-6xl font-extrabold tracking-tight lg:text-8xl text-gray-800 ${singleDay.className}`}>
              Anon DMs
            </h1>
            </motion.div>
          <p className='mb-4'>Create an account to receive anonymous messages</p>
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 flex flex-col w-full'>
          {/* //Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                <input {...field}
                placeholder="Username"
                onChange={(e) => {
                  field.onChange(e);
                  debounced(e.target.value);
                }}
                className="w-full px-3 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-cyan-500" />

                </FormControl>
                <FormDescription>
                </FormDescription>
                { loading }
                <p className={`text-sm  p-2 font-bold ${usernameMessage === "Username is available" ? "text-shadow-cyan-950" : "text-red-500"}`}>
                  {usernameMessage}
                </p>
                <FormMessage/>                
              </FormItem>
            )} 
            />
          {/* //Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                <input {...field}
                placeholder="anon11@dms.com"
                className="w-full px-3 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage/>                
              </FormItem>
            )} 
            />
          {/* //Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mt-6">Password</FormLabel>
                <FormControl>
                <input {...field}
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage/>                
              </FormItem>
            )} 
            />
          <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex justify-center items-center hover:scale-110 transform duration-300 hover:text-green-400 hover:font-bold mt-4">
            {
              isSubmitting? (
                <>
                  <Suspense fallback={
                    <h1>Loading....</h1>
                  }>
                    <Image src="/loading.gif" alt="Loading..." width={24} height={24} />
                  </Suspense>
                </>
              ):("Sign up")
            }
          </Button>
        </form>
      </Form>

      <div className="text-center mt-6">
        <p className={`text-gray-600 text-lg ${singleDay.className}`}>
          Already have an account?{' '}
        </p>
        <div className="flex justify-center place-items-center mt-3">
          <Navigation href="/signin" label="Sign in" className="w-fit text-2xl text-blue-600 hover:text-amber-400 hover:scale-110 hover:bg-cyan-700 duration-300 rounded-4xl p-2" />
        </div>
      </div>

      </div>
    </div>
      </>
  )
}

export default page
