"use client"

import React, { Suspense } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Tinos } from 'next/font/google';
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
import { signIn } from 'next-auth/react'

const tinos = Tinos({ weight: ['400'], subsets: ['latin'] });

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
            <h1 className={`text-6xl font-extrabold tracking-tight lg:text-8xl text-gray-800 ${tinos.className}`}>
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

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-cyan-800/60 px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* GitHub Sign Up Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
        className="w-full flex items-center justify-center gap-2 hover:scale-105 transform duration-300 border-2 border-black bg-white text-black hover:bg-gray-100"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
        Sign up with GitHub
      </Button>

      <div className="text-center mt-32">
            <div className="-mt-28 flex justify-evenly">
              <motion.img
              initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
              animate={{ clipPath: 'inset(0 0% 0% 0)', opacity: 1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              draggable={false}
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
              }}
              src="/doodleArrow.png"
              alt="Description"
              width={50}
              height={50}
              />
            </div>
          <p className={`text-gray-600 text-2xl font-${400} ${tinos.className}`}>
            Already have an account?{' '}
            <br />
            <button>
              <Navigation href="/signin" label="Sign in" className="text-3xl text-blue-600 hover:text-amber-400 hover:scale-110 hover:bg-cyan-700 duration-300 rounded-4xl p-2" />
            </button>
          </p>
        </div>

      </div>
    </div>
      </>
  )
}

export default page
