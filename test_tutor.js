import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    vertexai: true,
    project: "gen-lang-client-0120070959",
    location: "global",
});
const model = "gemini-2.5-flash-lite";

async function test() {
    try {
        const generationConfig = {
            maxOutputTokens: 300,
            temperature: 0.3,
        };
        const response = await ai.models.generateContent({
            model: model,
            contents: "test",
            config: generationConfig,
        });
        console.log("Response:", response.text);
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
