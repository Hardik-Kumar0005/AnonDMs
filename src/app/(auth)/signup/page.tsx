"use client"

import React, { Suspense } from 'react'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
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
          const response = await axios.get(`/api/users/check-username?username=${debouncedUsername}`);
          console.log (response);
          setUsernameMessage(response.data.message);
        }
        catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
              setUsernameMessage("Username is already taken");
            } else {
              setUsernameMessage("Error checking username");
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
    <div className='relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-600 to-purple-600 text-white flex items-center justify-center'>
      {/* decorative blurred blobs */}
      <div className='absolute -left-24 -top-24 w-72 h-72 rounded-full bg-pink-500 opacity-30 blur-3xl animate-blob mix-blend-plus-lighter'></div>
      <div className='absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-cyan-400 opacity-25 blur-3xl animate-blob animation-delay-2000 mix-blend-plus-lighter'></div>

      <div className='z-10 flex w-full items-center justify-center p-6'>
        <div className='flex w-full max-w-4xl items-stretch justify-center gap-6'>
          {/* signup card (left) */}
          <div className='w-full max-w-md bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 transition-transform transform hover:-translate-y-1'>
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
                  setUsername(e.target.value);
                }}
                className='w-full bg-white/5 placeholder:text-white/60 text-white py-2 px-3 rounded-md border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow' />

                </FormControl>
                <FormDescription>
                  This is your unique username
                </FormDescription>
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

          {/* divider with slash */}
          <div className='hidden md:flex items-center justify-center px-2'>
            <div className='flex flex-col items-center'>
              <div className='h-24 flex items-center'>
                <span className='text-4xl text-white/60 select-none'>/</span>
              </div>
            </div>
          </div>

          {/* sign-in card (right) */}
          <div className='hidden md:flex flex-col items-center justify-center w-56'>
            <Navigation href="/signin" label="Sign in" className='text-amber-700'>
              <h3 className='font-semibold text-white mb-1'>Sign in</h3>
              <p className='text-sm text-white/80'>Already have an account?</p>
            </Navigation>
          </div>

        </div>
      </div>
    </div>
      </>
  )
}

export default page
