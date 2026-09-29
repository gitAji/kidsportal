import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { safeErrorResponse } from '@/lib/apiError';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash-lite";

export async function POST(request) {
    try {
        const { text, targetLanguage } = await request.json();

        if (!text || !targetLanguage) {
            return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
        }

        const prompt = `Translate the following text into ${targetLanguage === 'ta' ? 'Tamil' : 'English'}. Respond ONLY with the translated text. Do not add any extra commentary or formatting.
        
Text to translate:
${text}`;

        const generationConfig = {
            temperature: 0.3,
        };

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: generationConfig,
        });

        const translatedText = response.text?.trim() || text;

        return NextResponse.json({ translatedText });

    } catch (error) {
        return safeErrorResponse('Translation Error:', error, 'Failed to translate text.');
    }
}
