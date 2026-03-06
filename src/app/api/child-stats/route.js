// src/app/api/child-stats/route.js
// API route for reading and writing child stats & achievements
// Uses Admin SDK to bypass Firestore security rules (children have no Auth session)
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// GET — Fetch stats + achievements for a child
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const childId = searchParams.get('childId');
        const parentUid = searchParams.get('parentUid');

        if (!childId || !parentUid) {
            return NextResponse.json({ error: 'Missing childId or parentUid' }, { status: 400 });
        }

        // Verify the child actually belongs to this parent
        const childDoc = await adminDb.doc(`users/${parentUid}/children/${childId}`).get();
        if (!childDoc.exists) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 });
        }

        // Fetch stats
        const statsDoc = await adminDb.doc(`childStats/${childId}`).get();
        const stats = statsDoc.exists ? statsDoc.data() : {};

        // Fetch achievements
        const achSnap = await adminDb.collection('achievements')
            .where('childId', '==', childId)
            .get();
        const achievements = achSnap.docs.map(d => d.data());

        return NextResponse.json({ stats, achievements });
    } catch (error) {
        console.error('Child stats GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — Save stats and/or record new achievements
export async function POST(request) {
    try {
        const { childId, parentUid, stats, newAchievements } = await request.json();

        if (!childId || !parentUid) {
            return NextResponse.json({ error: 'Missing childId or parentUid' }, { status: 400 });
        }

        // Verify the child actually belongs to this parent
        const childDoc = await adminDb.doc(`users/${parentUid}/children/${childId}`).get();
        if (!childDoc.exists) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 });
        }

        const batch = adminDb.batch();

        // Save stats
        if (stats) {
            const statsRef = adminDb.doc(`childStats/${childId}`);
            batch.set(statsRef, {
                ...stats,
                updatedAt: FieldValue.serverTimestamp(),
            }, { merge: true });
        }

        // Record new achievements
        if (newAchievements && newAchievements.length > 0) {
            for (const ach of newAchievements) {
                const achRef = adminDb.doc(`achievements/${childId}_${ach.id}`);
                batch.set(achRef, {
                    childId,
                    achievementId: ach.id,
                    name: ach.name,
                    emoji: ach.emoji,
                    unlockedAt: FieldValue.serverTimestamp(),
                });
            }
        }

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Child stats POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
