"use client"

import React from 'react'
import Navbar from '@/app/Navbar'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { messageSchema } from '@/schemas/messageSchema'
import { usePathname, useParams } from 'next/navigation'

type FormValues = z.infer<typeof messageSchema>

export default function Page() {
  const params = useParams() as { username?: string }
  const pathname = usePathname()

  const usernameFromPath = React.useMemo(() => {
    if (!pathname) return undefined
    const parts = pathname.split('/').filter(Boolean)
    return parts.length ? parts[parts.length - 1] : undefined
  }, [pathname])

  const username = usernameFromPath || params?.username || ''

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({ resolver: zodResolver(messageSchema) })
  const { register, handleSubmit, reset, formState: { errors } } = form

  const onSubmit = async (data: FormValues) => {
    if (!username) {
      toast.error('Missing username')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await axios.post('/api/send-message', {
        username,
        content: { content: data.content }
      })
      if (res.data?.success) {
        toast.success('Message sent')
        reset()
      } else {
        toast.error(res.data?.message || 'Failed to send message')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <div className='bg-amber-400 border-8 border-black min-h-screen'>
      {isLoggedIn ? (
        <div className='w-full bg-white/80 border-b border-black p-4'>
          <div className='max-w-6xl mx-auto'>
            <span className='font-bold'>Logged in</span>
          </div>
        </div>
      ) : (
        <Navbar />
      )}

      <Image
        src={'/dashDoddle.png'}
        alt={'Background'}
        fill
        style={{ objectFit: 'cover', pointerEvents: 'none' }}
        className={'mt-4 z-0 pointer-events-none'}
      />

      <div className='w-screen min-h-screen flex flex-col p-6 justify-start mx-auto items-center pt-32'>
        <div className='relative z-20 w-full max-w-5xl px-4'>
          <h2 className='text-4xl font-bold mb-4'>Send a message to @{username}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xl bg-white/80 p-6 rounded-lg border border-black' style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}>
            <div className='mb-4'>
              <textarea
                {...register('content')}
                rows={4}
                className='w-full p-3 border-2 border-black rounded resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500'
                placeholder='Write your anonymous message here...'
              />
              {errors.content && <p className='text-red-600 mt-2'>{(errors.content as any).message}</p>}
            </div>

            <div className='flex items-center justify-between'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-cyan-400 px-4 py-2 rounded-2xl text-black hover:bg-amber-400 disabled:opacity-50'
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              <p className='text-sm text-gray-700'>Messages are sent anonymously</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
