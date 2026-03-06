import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const model = "gemini-2.5-flash-lite";

export const POST = async (req) => {
    try {
        const { content, actionType, gradeId } = await req.json();

        let prompt = "";
        if (actionType === "simplify") {
            prompt = `The student is an elementary student in ${gradeId || 'school'}. They are trying to learn this concept: "${content}". 
Rewrite this concept to be EXTREMELY simple, using shorter sentences, kid-friendly analogies, and very easy vocabulary. Respond with a short, highly encouraging message. Skip any greetings, just output the simpler explanation directly.`;
        } else if (actionType === "example") {
            prompt = `The student is in ${gradeId || 'school'}. They are learning: "${content}". 
Give ONE super fun, real-world example of this concept that a kid would absolutely love (think pizza, toys, superheroes, or animals). ONLY give the example, make it exciting, and keep it under 3 sentences.`;
        } else if (actionType === "practice") {
            prompt = `The student is in ${gradeId || 'school'}. They just learned: "${content}". 
Ask them ONE fun, simple interactive thinking question to test their understanding. Do not provide the answer. ONLY ask the question.`;
        } else {
            prompt = `Explain "${content}" to a kid in ${gradeId || 'elementary school'}.`;
        }

        const genModel = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.3,
            }
        });

        const result = await genModel.generateContent(prompt + "\n\nCRITICAL RULE: DO NOT use any markdown formatting, asterisks, or special characters like ** in your response. Keep it as pure plain text so it can be read out loud clearly by a voice synthesizer.");
        const responseText = result.response.text();

        // Strip out any asterisks or hashtags that somehow slipped through
        const cleanText = (responseText || "").replace(/[*#]/g, "");

        return new Response(JSON.stringify({ response: cleanText }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Tutor Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate tutor response." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
