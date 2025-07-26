const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GCP_PROJECT_ID, // Use environment variables
  location: "global", // Adjust this if you have a specific region
});

const model = "gemini-2.5-flash-lite";

const siText1 = {
  text: `KidsPortal is an online learning platform designed for children...`,
};

const generationConfig = {
  maxOutputTokens: 1024,
  temperature: 0.2,
  topP: 0.8, // Default safety settings will be used. Adjust as needed.
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
      body: JSON.stringify({ error: "Method Not Allowed" }), // Allow only POST requests
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
      body: JSON.stringify({ response: resultText }), // Return the generated response
    };
  } catch (error) {
    console.error("Error in function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate a response" }), // Handle errors
    };
  }
};
