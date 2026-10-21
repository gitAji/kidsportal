// src/app/api/reset-level/route.js
// Lets a parent reset a specific level's completion for their child — e.g.
// after noticing poor quiz/exam performance — so the child sees it as not
// completed and can retry it. Uses the Admin SDK (same pattern as
// child-stats) since this mutates data a parent's own Firestore security
// rules shouldn't normally allow them to touch directly.
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { safeErrorResponse } from '@/lib/apiError';

export async function POST(request) {
    try {
        const { childId, parentUid, levelId, taskIds } = await request.json();

        if (!childId || !parentUid || !levelId || !Array.isArray(taskIds) || taskIds.length === 0) {
            return NextResponse.json({ error: 'Missing childId, parentUid, levelId, or taskIds' }, { status: 400 });
        }

        // Verify the child actually belongs to this parent.
        const childDoc = await adminDb.doc(`users/${parentUid}/children/${childId}`).get();
        if (!childDoc.exists) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 });
        }

        const statsRef = adminDb.doc(`childStats/${childId}`);
        const statsSnap = await statsRef.get();
        const stats = statsSnap.exists ? statsSnap.data() : {};

        const batch = adminDb.batch();

        // Un-complete this level's tasks and drop it from the completed-levels
        // list, so the kid-facing app sees it as locked-for-redo again. This
        // intentionally does NOT touch totalScore/medals/XP already earned —
        // those stay as lifetime totals; only the level's "done" state resets,
        // so a fresh attempt is scored like any first attempt.
        batch.set(statsRef, {
            completedTasks_list: FieldValue.arrayRemove(...taskIds),
            levelsCompleted: FieldValue.arrayRemove(levelId),
            updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });

        // Clear this level's quiz/exam attempt history so a parent-facing
        // report doesn't keep showing the old poor attempts once the child
        // retries — a clean slate for this level specifically.
        const historySnap = await adminDb
            .collection(`childStats/${childId}/taskHistory`)
            .where('levelId', '==', levelId)
            .get();
        historySnap.docs.forEach((d) => batch.delete(d.ref));

        await batch.commit();

        return NextResponse.json({ success: true, clearedHistoryCount: historySnap.size });
    } catch (error) {
        return safeErrorResponse('Reset level error:', error, 'Failed to reset this level.');
    }
}
