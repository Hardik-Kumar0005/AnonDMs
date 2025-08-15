// app/api/completion/route.ts (Next.js App Router)

import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three unique, fun, and slightly “spicy” (intriguing but safe) open-ended questions formatted as a single string. Each question should be separated by ||. These questions are for an anonymous social messaging platform like Qooh.me or NGL and should appeal to a wide range of people. Avoid deeply personal, overly sensitive, or NSFW topics, but feel free to add playful, bold, or unexpected twists that spark curiosity. Make sure they feel fresh, conversational, and likely to grab someone’s attention.";

    // Stream text using the AI SDK
    const result = streamText({
      // Pick a current OpenAI text model:
      model: openai('gpt-4o-mini'),
      prompt,
      // Mirrors your previous `max_tokens: 400`
      maxOutputTokens: 400,
    });

  // Return a proper streaming response (replacement for StreamingTextResponse)
      return result.toTextStreamResponse();
    } catch (error) {
    // Generic error handling (no API key or stack traces leaked)
    return NextResponse.json(
      { name: 'Error', message: {error} },
      { status: 500 },
    );
  }
}
