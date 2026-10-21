// src/lib/geminiAuth.js
// When GEMINI_API_KEY isn't set anywhere in the environment, the
// @google/genai SDK silently falls back to Vertex AI / Application
// Default Credentials instead of erroring immediately — so any route that
// calls it fails deep inside the SDK with Google's generic
// "Could not load the default credentials" message, which points at
// Google Cloud auth docs and gives no hint that this app just needs an
// API key. Checking up front lets every AI route fail fast with an
// actionable message instead.
import { NextResponse } from 'next/server';

export function missingGeminiKeyResponse() {
    if (process.env.GEMINI_API_KEY) return null;
    console.error(
        'GEMINI_API_KEY is not set — AI routes will fail. ' +
        'Get a free key at https://aistudio.google.com/apikey and set it in your environment (.env.local locally, or your host\'s environment variables for a deployment).'
    );
    return NextResponse.json(
        { error: 'AI features are not configured on the server yet. Please try again later.' },
        { status: 500 }
    );
}
