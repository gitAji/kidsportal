// src/lib/apiError.js
// Shared helper for API route catch blocks. Logs the full error server-side
// (stack, message, everything) but only ever sends a short, generic message
// to the client — raw error.message/stack can leak internal file paths,
// dependency/library details, or third-party (Stripe/Firestore/AI SDK)
// error text that's meaningless to a parent or child and useful to an
// attacker probing the app.
import { NextResponse } from 'next/server';

export function safeErrorResponse(context, error, fallbackMessage = 'Something went wrong. Please try again.', status = 500) {
    console.error(context, error);
    return NextResponse.json({ error: fallbackMessage }, { status });
}
