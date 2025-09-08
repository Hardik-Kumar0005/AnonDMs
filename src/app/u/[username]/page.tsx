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
import DashNavbar from '@/app/dashboard/DashNavbar'
import { Cat, Sparkles, RefreshCw } from 'lucide-react'

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
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const form = useForm<FormValues>({ resolver: zodResolver(messageSchema) })
  const { register, handleSubmit, reset, formState: { errors }, setValue } = form

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

  // Function to fetch AI suggestions
  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true)
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ''
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += decoder.decode(value)
        }
      }
      
      // Split the result by || to get individual suggestions
      const suggestionsArray = result.split('||').map(s => s.trim()).filter(s => s.length > 0)
      setSuggestions(suggestionsArray)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      toast.error('Failed to load suggestions')
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setValue('content', suggestion)
    setShowSuggestions(false)
  }

  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <div className='bg-amber-400 border-8 border-black min-h-screen rounded-4xl'>
      {isLoggedIn ? ( <DashNavbar /> ) : (
        <Navbar />
      )}

      <Image
            src="/dashBg.jpg"
            alt="Background"
            fill
            priority
            className="object-cover pointer-events-none select-none rounded-4xl opacity-80"
            />

      <Image
        src={'/dashDoddle.png'}
        alt={'Background'}
        fill
        style={{ objectFit: 'cover', pointerEvents: 'none' }}
        className={'mt-4 z-0 pointer-events-none'}
      />

      <div className='w-screen min-h-screen flex flex-col p-6 justify-start mx-auto items-center pt-32'>
        <div className='relative z-20 w-full max-w-5xl px-4 flex flex-col items-center '>
            {isLoggedIn ? <h2 className='text-4xl font-bold mb-4 flex items-center gap-2'>Sending a message to yourself? <Cat className='h-10 w-10' /></h2>
          :
           (
        <h2 className='text-4xl font-bold mb-4'>Send a message to @{username}</h2>
      )}

          {/* AI Suggestions Section */}
          <div className='w-full max-w-xl mb-4'>
            <div className='flex items-center justify-between mb-3'>
              <button
                type='button'
                onClick={fetchSuggestions}
                disabled={isLoadingSuggestions}
                className='flex items-center gap-2 bg-cyan-400 text-black px-4 py-2 rounded-2xl hover:bg-purple-500 disabled:opacity-50 transition-colors border-2 border-black'
                style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
              >
                {isLoadingSuggestions ? (
                  <RefreshCw className='h-4 w-4 animate-spin' />
                ) : (
                  <Sparkles className='h-4 w-4' />
                )}
                {isLoadingSuggestions ? 'Getting ideas...' : 'Get AI suggestions'}
              </button>
              
              {showSuggestions && suggestions.length > 0 && (
                <button
                  type='button'
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className='text-sm text-black hover:text-gray-800 underline'
                  style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                >
                  {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                </button>
              )}
            </div>
            
            {/* Suggestions List */}
            {showSuggestions && suggestions.length > 0 && (
              <div className='bg-transparent border-2 border-black rounded-lg p-4 mb-4' style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}>
                <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                  <Sparkles className='h-4 w-4' />
                  AI Suggested Messages
                </h3>
                <div className='space-y-2'>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => handleSuggestionClick(suggestion)}
                      className='w-full text-left p-3 bg-cyan-400 border-2 rounded-lg hover:bg-cyan-100 hover:border-cyan-400 transition-colors text-sm'
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <p className='text-xs text-black mt-2'>Click any suggestion to use it as your message</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xl mt-4 bg-transparent p-6 rounded-lg border border-black' style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}>
            <div className='mb-4'>
              <textarea
                {...register('content')}
                rows={4}
                className='w-full p-3 border-2 bg-cyan-300/40 border-black rounded resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500'
                placeholder='Write your anonymous message here...'
              />
              {errors.content && <p className='text-red-600 mt-2'>{(errors.content as any).message}</p>}
            </div>

            <div className='flex items-center justify-between'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-cyan-400 px-4 py-2 rounded-2xl text-black border-2 hover:bg-amber-400 disabled:opacity-50'
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              <p className='text-sm text-black'>Messages are sent anonymously</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
