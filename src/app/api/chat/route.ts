import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message: userMessage, chatHistory, model: selectedModel, systemPrompt } = await request.json();
    
    console.log('Original user message in chat API:', userMessage); // Debugging line

    console.log('User message before truncation:', userMessage); // Debugging line
    // Log the chat API request
    await fetch('http://localhost:3000/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'CHAT API REQUEST',
        message: userMessage.substring(0, 10),
        Model: selectedModel,
      }),
    });

    if (typeof userMessage !== 'string' || !Array.isArray(chatHistory) || typeof selectedModel !== 'string' || typeof systemPrompt !== 'string') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const messages: ChatCompletionMessageParam[] = [];

    // Add system prompt
    messages.push({
      role: 'system',
      content: systemPrompt,
    });

    // Add previous messages from chat history
    chatHistory.forEach((chat: { role: string; content: string }) => {
      if (chat.role === 'user' || chat.role === 'ai') {
        messages.push({
          role: chat.role === 'user' ? 'user' : 'assistant',
          content: chat.content,
        });
      }
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    const response = await groq.chat.completions.create({
      messages,
      model: selectedModel,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async pull(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}