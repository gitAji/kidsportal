// src/app/api/admin/pilot-program/route.js
// Super-admin-only: grant/revoke free "pilot" access to hand-picked
// families, and report how their setup and their kids' progress is going
// — for a small lunch-and-learn style pilot (5-10 families), not the
// platform-wide analytics the teacher-admin Reports page already covers.
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifySuperAdmin } from '@/lib/verifySuperAdmin';
import { safeErrorResponse } from '@/lib/apiError';

function toMillis(ts) {
    if (!ts) return null;
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d.getTime();
}

function topEntry(counts) {
    const entries = Object.entries(counts || {});
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
}

async function buildChildSummary(parentUid, childDoc) {
    const child = childDoc.data();
    const childId = childDoc.id;

    const statsSnap = await adminDb.doc(`childStats/${childId}`).get();
    const stats = statsSnap.exists ? statsSnap.data() : {};

    const createdAtMs = toMillis(child.createdAt);
    const firstLoginAtMs = toMillis(child.firstLoginAt);
    const setupMinutes = (createdAtMs && firstLoginAtMs && firstLoginAtMs >= createdAtMs)
        ? Math.round((firstLoginAtMs - createdAtMs) / 60000)
        : null;

    const timeUsage = stats.timeUsage || {};
    const totalMinutesActive = Math.round(
        Object.values(timeUsage).reduce((sum, v) => sum + (Number(v) || 0), 0)
    );

    return {
        id: childId,
        parentUid,
        name: child.name || 'Student',
        grade: child.grade || null,
        loginEnabled: child.loginEnabled !== false,
        createdAt: createdAtMs,
        firstLoginAt: firstLoginAtMs,
        lastActive: toMillis(child.lastActive),
        setupMinutes,
        totalTasksCompleted: stats.totalTasksCompleted || 0,
        totalScore: stats.totalScore || 0,
        uniqueDaysActive: stats.uniqueDays || 0,
        totalMinutesActive,
        topInterestSubject: topEntry(stats.subjectLevelCounts),
        subjectsExplored: stats.subjectsExplored_list || [],
    };
}

export async function GET(request) {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    if (!adminDb) {
        return NextResponse.json({ error: 'Admin database not configured.' }, { status: 500 });
    }

    try {
        const usersSnap = await adminDb.collection('users').get();

        // Lightweight summary of every parent, for the "pick your testers" search.
        const allParents = await Promise.all(usersSnap.docs.map(async (doc) => {
            const data = doc.data();
            const childrenSnap = await adminDb.collection(`users/${doc.id}/children`).get();
            return {
                uid: doc.id,
                email: data.email || null,
                displayName: data.displayName || data.firstName || null,
                createdAt: toMillis(data.createdAt),
                pilotAccess: !!data.pilotAccess,
                pilotAccessGrantedAt: toMillis(data.pilotAccessGrantedAt),
                childCount: childrenSnap.size,
                childDocs: childrenSnap.docs, // reused below for pilot families only
            };
        }));

        // Deeper per-child progress/engagement only for the actual pilot
        // cohort — this is the part that needs an Auth lookup + a stats
        // read per child, so it stays small by design (5-10 families).
        const pilotFamilies = allParents.filter((p) => p.pilotAccess);
        const pilotDetails = await Promise.all(pilotFamilies.map(async (p) => {
            let emailVerified = null;
            try {
                const authUser = await adminAuth.getUser(p.uid);
                emailVerified = !!authUser.emailVerified;
            } catch (err) {
                console.error(`Pilot program: failed to look up auth record for ${p.uid}`, err);
            }

            const children = await Promise.all(p.childDocs.map((childDoc) => buildChildSummary(p.uid, childDoc)));

            return {
                uid: p.uid,
                email: p.email,
                displayName: p.displayName,
                createdAt: p.createdAt,
                pilotAccessGrantedAt: p.pilotAccessGrantedAt,
                emailVerified,
                children,
            };
        }));

        const publicParents = allParents.map(({ childDocs, ...rest }) => rest);

        return NextResponse.json({ allParents: publicParents, pilotDetails });
    } catch (error) {
        return safeErrorResponse('Pilot program GET error:', error, 'Failed to load pilot program data.');
    }
}

export async function POST(request) {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    if (!adminDb) {
        return NextResponse.json({ error: 'Admin database not configured.' }, { status: 500 });
    }

    try {
        const { parentUid, pilotAccess } = await request.json();
        if (!parentUid || typeof pilotAccess !== 'boolean') {
            return NextResponse.json({ error: 'Missing parentUid or pilotAccess.' }, { status: 400 });
        }

        const userRef = adminDb.doc(`users/${parentUid}`);
        const userSnap = await userRef.get();
        if (!userSnap.exists) {
            return NextResponse.json({ error: 'Parent not found.' }, { status: 404 });
        }

        await userRef.set({
            pilotAccess,
            pilotAccessGrantedAt: pilotAccess ? FieldValue.serverTimestamp() : FieldValue.delete(),
            pilotAccessGrantedBy: pilotAccess ? admin.email : FieldValue.delete(),
        }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        return safeErrorResponse('Pilot program POST error:', error, 'Failed to update pilot access.');
    }
}
