import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
const ai = new GoogleGenAI({
    vertexai: true,
    project: process.env.FIREBASE_ADMIN_PROJECT_ID,
    location: "europe-west1",
    credentials: {
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      private_key: private_key,
    }
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
