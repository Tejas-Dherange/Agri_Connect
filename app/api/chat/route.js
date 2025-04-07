import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for agricultural context
const SYSTEM_PROMPT = `You are an agricultural expert assistant. Your role is to:
1. Provide accurate and practical advice about farming, crops, and agricultural practices
2. Help farmers with pest control, soil management, and crop care
3. Suggest appropriate fertilizers and pesticides based on specific conditions
4. Give weather-based farming recommendations
5. Explain agricultural concepts in simple terms
6. Provide market insights and pricing information when relevant
7. Always consider local farming conditions and practices

Remember to:
- Be specific and actionable in your advice
- Consider environmental impact in your recommendations
- Stay within the scope of agricultural expertise
- Acknowledge when you don't have enough information
- Suggest consulting local agricultural experts when appropriate`;

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Format history correctly for Gemini
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start a chat session with the system prompt
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: "model",
          parts: [{ text: "I understand. I will provide expert agricultural advice and assistance." }]
        },
        ...formattedHistory
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Send the message and get the response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      success: true, 
      response: text 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ 
      error: 'Failed to process chat message',
      details: error.message 
    }, { status: 500 });
  }
}