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
        const { childId, parentUid, stats, newAchievements, sessionHistory, taskId, attemptNumber, isRetake, subjectId, levelId, score, type, taskName } = await request.json();

        if (!childId || !parentUid) {
            return NextResponse.json({ error: 'Missing childId or parentUid' }, { status: 400 });
        }

        // Verify the child actually belongs to this parent
        const childDoc = await adminDb.doc(`users/${parentUid}/children/${childId}`).get();
        if (!childDoc.exists) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 });
        }

        const batch = adminDb.batch();

        // 1. Save detailed stats to childStats collection
        if (stats) {
            const statsRef = adminDb.doc(`childStats/${childId}`);
            batch.set(statsRef, {
                ...stats,
                updatedAt: FieldValue.serverTimestamp(),
            }, { merge: true });

            // 2. Sync to Child Profile for Parent Dashboard & Reports
            // We update points, level, and stars in the child document
            const childRef = adminDb.doc(`users/${parentUid}/children/${childId}`);

            // Map our recordTaskCompletion stats to the child document fields
            const syncData = {
                points: stats.totalScore || 0,
                level: stats.currentLevel || 1,
                stars: stats.totalStars || 0,
                lastActive: FieldValue.serverTimestamp()
            };

            // If we have task info, record it in the assignedTasks array (even if it wasn't pre-assigned)
            if (taskId || stats.taskId) {
                const taskEntry = {
                    taskId: taskId || stats.taskId,
                    taskName: taskName || stats.taskName || taskId || stats.taskId, // fallback
                    subjectId: subjectId || stats.subjectId || 'unknown_subject',
                    levelId: levelId || stats.levelId || 'unknown_level',
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    score: score ?? stats.score ?? 0,
                    type: type || stats.type || 'task',
                    attemptNumber: attemptNumber || 1,
                    isRetake: !!isRetake
                };

                // Use FieldValue.arrayUnion to add to assignedTasks
                syncData.assignedTasks = FieldValue.arrayUnion(taskEntry);
            }

            batch.set(childRef, syncData, { merge: true });
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

        // Record user interaction history for AI analysis
        if (sessionHistory && sessionHistory.length > 0) {
            const historyRef = adminDb.collection(`childStats/${childId}/taskHistory`).doc();
            batch.set(historyRef, {
                taskId: taskId || (stats && stats.taskId) || "unknown_task",
                subjectId: subjectId || (stats && stats.subjectId) || "unknown_subject",
                levelId: levelId || (stats && stats.levelId) || "unknown_level",
                taskName: taskName || (stats && stats.taskName) || null,
                timestamp: FieldValue.serverTimestamp(),
                history: sessionHistory,
                score: score ?? (stats && stats.score) ?? 0,
                type: type || (stats && stats.type) || "task",
                attemptNumber: attemptNumber || 1,
                isRetake: !!isRetake
            });
        }

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Child stats POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
