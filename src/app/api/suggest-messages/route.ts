// app/api/generate/route.ts (or route.js)

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const prompt =
      "Something a silly cat would say";

    // Generate text using AI SDK (no streaming)
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    });
    
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
