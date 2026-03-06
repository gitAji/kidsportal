import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash-lite";

// AI grades an open-ended student answer
export async function POST(request) {
    try {
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

Respond ONLY with valid JSON matching this schema exactly.`;

        const genModel = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.1, // low temp for accurate grading
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        isCorrect: { type: "boolean", description: "Whether the answer is correct or not" },
                        feedback: { type: "string", description: "Short supportive feedback" }
                    },
                    required: ["isCorrect", "feedback"]
                }
            }
        });

        const result = await genModel.generateContent(prompt);
        const evaluation = JSON.parse(result.response.text());

        return NextResponse.json(evaluation);

    } catch (error) {
        console.error('AI Evaluation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
