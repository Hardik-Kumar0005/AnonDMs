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
import Navigation from '@/utils/Navigation';
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
      <div
        className="w-full max-w-md md:p-8 p-4 space-y-8 bg-transparent rounded-lg"
      >
        <div className="text-center">
            <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-block rounded-full shadow-lg px-8 py-4 mb-6 border-2 border-black">
            <h1 className={`text-6xl font-extrabold tracking-tight lg:text-8xl text-gray-800 ${singleDay.className}`}>
              Anon DMs
            </h1>
            </motion.div>
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
                  <FormLabel>
                    <motion.p
                    initial={{ opacity: 0,  }}
                    animate={{ opacity: 1,  }}
                    transition={{ duration: 2 }}
                    className='text-2xl'
                    >Email / Username</motion.p>
                  </FormLabel>
                  <input
                    {...field}
                    className="w-full px-3 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  <FormLabel>
                    <motion.p
                    initial={{ opacity: 0,  }}
                    animate={{ opacity: 1,  }}
                    transition={{ duration: 2 }}
                    className='text-2xl'
                    >Password </motion.p>
                  </FormLabel>
                  <input
                    type="password"
                    {...field}
                    className="w-full px-3 py-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full flex justify-center items-center hover:scale-110 transform duration-300 hover:text-green-400 hover:font-bold"
              type="submit"
            >
              Sign In
            </  Button>
          </form>
        </Form>
        <div className="text-center mt-32">
            <div className="mt-28 flex justify-evenly">
              <motion.img
              initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
              animate={{ clipPath: 'inset(0 0% 0% 0)', opacity: 1 }}
              transition={{ duration: 4, ease: 'easeOut' }}
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
            <button>
              <Navigation href="/signup" label="Sign up" className="text-3xl text-blue-600 hover:text-amber-400 hover:scale-110 hover:bg-cyan-700 duration-300 rounded-4xl p-2" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;