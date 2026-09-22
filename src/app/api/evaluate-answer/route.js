import { NextResponse } from 'next/server';
import OpenAI from "openai";

const model = "grok-4.6";

// AI grades an open-ended student answer
export async function POST(request) {
    try {
        const grok = new OpenAI({
            apiKey: process.env.GROK_API_KEY || process.env.XAI_API_KEY,
            baseURL: "https://api.x.ai/v1",
        });

        const { questionText, studentAnswer, correctAnswer } = await request.json();

        if (!questionText || !studentAnswer || !correctAnswer) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const prompt = `You are an encouraging, friendly AI tutor for kids.
You need to grade a student's answer.

Question: "${questionText}"
Target Correct Answer: "${correctAnswer}"
Student's Answer: "${studentAnswer}"

Evaluate if the student's answer is correct or conceptually correct based on the target answer. Allow for minor spelling mistakes, partial but correct answers, or extra words (e.g., if the target is "Apple" and they write "An apple" or "Aple", that is correct). Always respond on the side of giving the kid the point if they grasped the concept.

Provide two things:
1. isCorrect: boolean (true or false)
2. feedback: A short, encouraging message for the kid directly. If correct, praise them (e.g. "Great job! A cat makes a meow sound!"). If wrong, gently explain why or give a very helpful hint (e.g. "Not quite! Think about the animal with whiskers that says 'meow'.").

Respond ONLY with valid JSON matching this exact shape, no extra text: {"isCorrect": boolean, "feedback": string}`;

        const completion = await grok.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1, // low temp for accurate grading
            response_format: { type: "json_object" },
        });

        const raw = completion.choices?.[0]?.message?.content || "{}";
        const evaluation = JSON.parse(raw);

        return NextResponse.json(evaluation);

    } catch (error) {
        console.error('AI Evaluation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
