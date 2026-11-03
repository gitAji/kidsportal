// src/app/api/behavior-event/route.js
// Lightweight first-party behavior log for the pilot cohort — records one
// small event per interaction (lesson card viewed, Listen tapped, a quiz
// answer submitted, etc.) as soon as it happens, not just at task
// completion. That's the piece /api/child-stats doesn't cover: if a kid
// abandons a quiz halfway, this is the only place that shows it.
// Uses the Admin SDK like /api/child-stats, since children have no Auth
// session to write Firestore directly under security rules.
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { safeErrorResponse } from '@/lib/apiError';

export async function POST(request) {
    try {
        const { childId, event, screen, metadata } = await request.json();

        if (!childId || !event) {
            return NextResponse.json({ error: 'Missing childId or event' }, { status: 400 });
        }

        await adminDb.collection(`childStats/${childId}/behaviorEvents`).add({
            event,
            screen: screen || null,
            metadata: metadata || {},
            timestamp: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return safeErrorResponse('Behavior event error:', error, 'Failed to log event.');
    }
}
