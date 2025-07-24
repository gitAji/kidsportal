const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  vertexai: true,
  project: "gen-lang-client-0120070959", // replace with your project ID
  location: "global", // or your Vertex AI region
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
  model,
  config: generationConfig,
});

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    const response = await chat.sendMessageStream({
      message: [{ text: message }],
    });

    let resultText = "";
    for await (const chunk of response) {
      if (chunk.text) resultText += chunk.text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ response: resultText }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate a response" }),
    };
  }
};
