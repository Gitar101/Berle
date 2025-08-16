import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  try {
    const models = await groq.models.list();
    const availableModels = models.data.map(model => ({
      id: model.id,
      name: model.id, // Groq models often use the ID as the name
    }));
    return NextResponse.json({ models: availableModels });
  } catch (error) {
    console.error('Error fetching Groq models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}