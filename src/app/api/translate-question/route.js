import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash-lite";

export async function POST(request) {
    try {
        const { question, targetLanguage } = await request.json();

        if (!question || !targetLanguage) {
            return NextResponse.json({ error: 'Missing question object or targetLanguage' }, { status: 400 });
        }

        const prompt = `Translate the following educational question into ${targetLanguage === 'ta' ? 'Tamil' : 'English'}.
Translate the 'questionText' and the 'options' (if they exist).

Original Question:
${JSON.stringify(question, null, 2)}

Respond ONLY with valid JSON matching the exact original schema structure.`;

        const generationConfig = {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questionText: { type: Type.STRING },
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["questionText"]
            }
        };

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: generationConfig,
        });

        const translatedData = JSON.parse(response.text);

        return NextResponse.json({ translatedData });

    } catch (error) {
        console.error('Translation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
