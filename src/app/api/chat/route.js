import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-proj-iAb9KlRC35pHpKNusk8YSn74yS3I0Zp--L9CeAYkPuwiNeoG4HSXMeJ1qfDE7woxZGYRBOfiaT3BlbkFJ0LA_2X-n_BTwW2VXAlf-hQMbRPC5LsJxz-ZM9iu_lVrTIhwp5OkRzFWsOjgsUUacdbDoJ2R0EA', // This should be loaded from environment variables in a production app
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Updated to gpt-4
      messages: [
        { "role": "system", "content": "You are a helpful assistant for a tutoring platform." },
        { "role": "user", "content": message }
      ],
      temperature: 0.7, // Added temperature parameter
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json({ reply: "I am sorry, but I am unable to respond at the moment." }, { status: 500 });
  }
}
