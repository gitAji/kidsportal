// /src/app/api/chat/route.js

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  vertexai: true,
  project: "gen-lang-client-0120070959",
  location: "global",
});

const model = "gemini-2.5-flash-lite";

const siText1 = {
  text: `KidsPortal is an online learning platform designed for children...`,
};

const generationConfig = {
  maxOutputTokens: 1024,
  temperature: 0.2,
  topP: 0.8,
  safetySettings: [
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
  ],
  systemInstruction: { parts: [siText1] },
};

const chat = ai.chats.create({
  model: model,
  config: generationConfig,
});

// Handle POST request
export const POST = async (req) => {
  const { message } = await req.json(); // Parse the incoming request body

  try {
    const response = await chat.sendMessageStream({
      message: [{ text: message }],
    });

    let resultText = "";
    for await (const chunk of response) {
      if (chunk.text) {
        resultText += chunk.text;
      }
    }

    return new Response(JSON.stringify({ response: resultText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling the request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate a response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
