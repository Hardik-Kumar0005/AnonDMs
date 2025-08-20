"use client"

import React, { Suspense } from 'react'
import Image from 'next/image'
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
    <div className='relative min-h-screen w-screen overflow-hidden text-white flex items-center justify-center'>
      {/* decorative blurred blobs */}
      <div className='absolute -left-24 -top-24 w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full bg-pink-500 opacity-30 blur-3xl animate-blob mix-blend-plus-lighter'></div>
      <div className='absolute -right-24 -bottom-24 w-52 h-52 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-cyan-400 opacity-25 blur-3xl animate-blob animation-delay-2000 mix-blend-plus-lighter'></div>

      <div className='z-10 flex w-full items-center justify-center p-6'>
        <div className='flex flex-col md:flex-row w-full max-w-4xl items-stretch justify-center gap-6'>
          {/* signup card (left) */}
          <div className='w-full max-w-md bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 transition-transform transform hover:-translate-y-1 z-10'>
              <h2 className='text-3xl font-bold text-center text-black mb-6 tracking-wide drop-shadow-lg'>SIGN UP!</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-stretch justify-center gap-4'>
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
                className='w-full bg-white/5 placeholder:text-white/60 text-white py-2 px-3 rounded-md border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow' />

                </FormControl>
                <FormDescription>
                  This is your unique username
                </FormDescription>
                { loading }
                <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"} mt-1`}>
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
                className='w-full bg-white/5 placeholder:text-white/60 text-white py-2 px-3 rounded-md border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow' 
                />

                </FormControl>
                <FormDescription>
                  This is your unique email
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                <input {...field}
                type="password"
                placeholder="Password"
                className='w-full bg-white/5 placeholder:text-white/60 text-white py-2 px-3 rounded-md border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow' 
                />

                </FormControl>
                <FormDescription>
                  Enter your password
                </FormDescription>
                <FormMessage/>                
              </FormItem>
            )} 
            />
          <Button 
          type="submit" 
          disabled={isSubmitting}
          className='w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 active:scale-100 transform transition-all shadow-lg text-white'>
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
            </div>
            <Image
              src="/loading.gif"
              alt="Loading..."
              width={550}
              height={150}
              className='absolute z-0 right-16'
            />

          {/* divider with slash
          <div className='hidden md:flex items-center justify-center px-2 mx-auto'>
            <div className='flex flex-col items-center'>
              <div className='h-24 flex items-center'>
                <span className='text-4xl text-black/60 select-none'>/</span>
              </div>
            </div>
          </div> */}

          {/* sign-in card (right) */}
            <div className='flex flex-col items-center justify-center w-full md:w-56 mx-auto mt-4 md:mt-0 order-2 md:order-none z-10'>
            <p className='text-sm text-black'>Already have an account?</p>
            <Navigation href="/signin" label="Sign in" className='text-amber-700'>
            </Navigation>
            </div>

        </div>
      </div>
    </div>
      </>
  )
}

export default page
