'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { Form, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { animatePageIn, animatePageOut } from '@/utils/animation';
import { motion, Variants } from 'motion/react';
import Image from 'next/image';

import { Single_Day } from 'next/font/google';
const singleDay = Single_Day({ weight: "400" });

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
    
    
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    });
    
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.success('Login Failed! Please recheck your credentials!');
      } else {
        toast.error(`Login Failed! ${result.error}`);
      }
      
  };
  if (result?.url) {
    animatePageOut('/dashboard', router);
  }
};


  return (
      <div
      className="flex justify-center items-center min-h-screen bg-cyan-800/60">
      <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1 }}
      className="w-full max-w-md md:p-8 p-4 space-y-8 bg-transparent rounded-lg">
        <div className="text-center">
            <div className="inline-block rounded-full shadow-lg px-8 py-4 mb-6 border-2 border-black">
            <h1 className={`text-6xl font-extrabold tracking-tight lg:text-8xl text-gray-800 ${singleDay.className}`}>
              Anon DMs
            </h1>
            </div>
          <p className="mb-4">Sign in to continue your secret convos</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col w-full"
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <motion.input
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1 }}
                    {...field}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
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
                  <input
                    type="password"
                    {...field}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full flex justify-center items-center hover:scale-110 transform duration-300"
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-32">
          <div className="-mt-28 flex justify-evenly">
            <Image
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
          <p className={`text-gray-600 text-2xl font-${400} ${singleDay.className}`}>
            Don't have an account?{' '}
            <br />
            <Link href="/signup" className="text-3xl text-blue-600 hover:text-amber-800">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default page;