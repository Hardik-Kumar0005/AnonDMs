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

function page() {
  const [ username, setUsername ] = React.useState("");
  const [usernameMessage, setUsernameMessage] = React.useState("");
  const [ loading, setLoading ] = React.useState(false);
  const [ isSubmitting, setIsSubmitting ] = React.useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
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
      <div className='flex flex-col justify-center items-center'>
        <div className='bg-green-800 rounded-4xl w-auto h-auto'>
        <p className='mt-2 text-3xl'>
          Don't have an account? 
        </p>
        </div>
      </div>
    </div>
    <div className='fixed z-10 top-3/4 left-1/3'>
          <Navigation href="/signup" label="Sign up" className='bg-green-500 rounded-2xl p-2'>
            <h3 className='text-lg font-semibold'>Sign up</h3>
          </Navigation>
    </div>
      </>
  )
}

export default page
