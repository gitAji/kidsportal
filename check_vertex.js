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

async function run() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "test",
            config: { maxOutputTokens: 30, temperature: 0.3 }
        });
        console.log("Response:", response.text);
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
