// src/app/api/admin/students/route.js
// Super-admin-only: every student (child profile) across every parent
// account, with support controls — view a stats summary, reset a login
// password, and block/unblock login — for when a parent asks support for
// a report, a reset, or to pause their child's account. Children aren't
// Firebase Auth users (they sign in via a username/password compared
// straight against their child doc, see src/app/api/child-login/route.js),
// so none of this goes through Firebase Auth — it's direct, admin-privileged
// Firestore reads/writes via adminDb, which is why it needs to live behind
// verifySuperAdmin rather than being a client-side Firestore read like the
// Parents page's own child COUNT already is.
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifySuperAdmin } from '@/lib/verifySuperAdmin';
import { safeErrorResponse } from '@/lib/apiError';

function toMillis(ts) {
    if (!ts) return null;
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d.getTime();
}

// Easy-to-read-aloud-over-the-phone reset password: no 0/O/1/l/I
// confusion, 8 characters.
function generatePassword() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let out = '';
    for (let i = 0; i < 8; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

async function findChild(parentUid, childId) {
    if (!parentUid || !childId) return null;
    const ref = adminDb.doc(`users/${parentUid}/children/${childId}`);
    const snap = await ref.get();
    if (!snap.exists) return null;
    return { ref, snap, data: snap.data() };
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
        const { searchParams } = new URL(request.url);
        const parentUid = searchParams.get('parentUid');
        const childId = searchParams.get('childId');

        // Detail mode: one student's fuller stats summary, fetched only
        // when the admin actually opens a report — the list below stays
        // cheap (no per-child stats read) no matter how many students
        // there are.
        if (parentUid && childId) {
            const child = await findChild(parentUid, childId);
            if (!child) {
                return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
            }
            const statsSnap = await adminDb.doc(`childStats/${childId}`).get();
            const stats = statsSnap.exists ? statsSnap.data() : {};
            const parentSnap = await adminDb.doc(`users/${parentUid}`).get();
            const parentData = parentSnap.exists ? parentSnap.data() : {};

            return NextResponse.json({
                id: childId,
                parentUid,
                parentEmail: parentData.email || null,
                parentName: parentData.displayName || parentData.firstName || null,
                name: child.data.name || 'Student',
                grade: child.data.grade || null,
                username: child.data.username || null,
                loginEnabled: child.data.loginEnabled !== false,
                createdAt: toMillis(child.data.createdAt),
                firstLoginAt: toMillis(child.data.firstLoginAt),
                lastActive: toMillis(child.data.lastActive),
                totalTasksCompleted: stats.totalTasksCompleted || 0,
                totalScore: stats.totalScore || 0,
                uniqueDaysActive: stats.uniqueDays || 0,
                totalMinutesActive: Math.round(
                    Object.values(stats.timeUsage || {}).reduce((sum, v) => sum + (Number(v) || 0), 0)
                ),
                subjectsExplored: stats.subjectsExplored_list || [],
            });
        }

        // List mode: every student, lightweight — only fields already on
        // the child doc itself, no extra read per student.
        const usersSnap = await adminDb.collection('users').get();
        const students = [];

        await Promise.all(usersSnap.docs.map(async (userDoc) => {
            const parentData = userDoc.data();
            const childrenSnap = await adminDb.collection(`users/${userDoc.id}/children`).get();
            childrenSnap.docs.forEach((childDoc) => {
                const c = childDoc.data();
                students.push({
                    id: childDoc.id,
                    parentUid: userDoc.id,
                    parentEmail: parentData.email || null,
                    parentName: parentData.displayName || parentData.firstName || null,
                    name: c.name || 'Student',
                    grade: c.grade || null,
                    username: c.username || null,
                    loginEnabled: c.loginEnabled !== false,
                    createdAt: toMillis(c.createdAt),
                    lastActive: toMillis(c.lastActive),
                });
            });
        }));

        students.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        return NextResponse.json({ students });
    } catch (error) {
        return safeErrorResponse('Admin students GET error:', error, 'Failed to load students.');
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
        const { action, parentUid, childId, loginEnabled } = await request.json();
        if (!action || !parentUid || !childId) {
            return NextResponse.json({ error: 'Missing action, parentUid or childId.' }, { status: 400 });
        }

        const child = await findChild(parentUid, childId);
        if (!child) {
            return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
        }

        if (action === 'setLoginEnabled') {
            if (typeof loginEnabled !== 'boolean') {
                return NextResponse.json({ error: 'loginEnabled must be a boolean.' }, { status: 400 });
            }
            await child.ref.set({
                loginEnabled,
                loginEnabledChangedBy: admin.email,
                loginEnabledChangedAt: FieldValue.serverTimestamp(),
            }, { merge: true });
            return NextResponse.json({ success: true, loginEnabled });
        }

        if (action === 'resetPassword') {
            const newPassword = generatePassword();
            await child.ref.set({
                password: newPassword,
                passwordResetBy: admin.email,
                passwordResetAt: FieldValue.serverTimestamp(),
            }, { merge: true });
            return NextResponse.json({ success: true, newPassword, username: child.data.username || null });
        }

        return NextResponse.json({ error: `Unknown action "${action}".` }, { status: 400 });
    } catch (error) {
        return safeErrorResponse('Admin students POST error:', error, 'Failed to update student.');
    }
}
