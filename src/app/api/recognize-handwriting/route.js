import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Transcribes a kid's handwritten canvas drawing into plain text, so the
// "write on screen" tool can hand a real answer back to the identification
// input instead of submitting the raw drawing as the answer itself.
export async function POST(request) {
    try {
        const { imageData, language } = await request.json();

        if (!imageData) {
            return NextResponse.json({ error: 'Missing imageData' }, { status: 400 });
        }

        const match = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!match) {
            return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
        }
        const [, mimeType, base64] = match;

        const prompt = `You are reading a young child's handwriting from a drawing canvas: colored strokes on a light background, possibly with a faint dashed letter template showing through underneath (ignore that template — only read the child's drawn strokes on top of it).
${language === 'ta' ? "The child is writing in Tamil script." : "The child is writing in English words, letters, or numbers."}
Transcribe EXACTLY what they wrote as plain text: just the word, letters, or number itself, with no extra commentary, quotes, or punctuation.
If the canvas is blank, or you genuinely cannot make out any real writing, respond with exactly: UNREADABLE`;

        const genModel = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await genModel.generateContent([
            prompt,
            { inlineData: { mimeType, data: base64 } },
        ]);
        const text = result.response.text().trim();

        if (!text || text.toUpperCase() === 'UNREADABLE') {
            return NextResponse.json({ recognized: null, error: "Couldn't read that — try writing a little bigger!" });
        }

        return NextResponse.json({ recognized: text });
    } catch (error) {
        console.error('Handwriting Recognition Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
