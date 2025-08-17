"use client"

import React from 'react'
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
    <div className='grid self-center bg-indigo-500 w-screen h-screen text-white'>
      <div className='flex flex-col justify-center left-1/2 items-center bottom-2/3'>
        <div className='bg-green-900 rounded-lg w-auto h-auto p-4 text-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center justify-center gap-4 p-4'>
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
                className='border p-2 rounded-lg' />

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
                className='border p-2 rounded-lg' 
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
                className='border p-2 rounded-lg' 
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
          disabled={isSubmitting}>
            {
              isSubmitting? (
                <>
                  <h1 className='mr-2'>Please wait</h1>
                </>
              ):("Sign up")
            }
          </Button>
        </form>
      </Form>
            </div>
          </div>
    </div>
    <div className='absolute bottom-1/3 left-1/3 transform -translate-x-1/2 size-28'>
          <Navigation href="/signin" label="Sign in" className='bg-green-500 rounded-2xl p-2'>
            <h3 className='font-semibold'>Sign in</h3>
          </Navigation>
    </div>
      </>
  )
}

export default page
