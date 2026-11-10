// src/app/api/admin/backfill-module-names/route.js
// Super-admin-only: fixes levels showing under the generic "Standard
// Lessons" group instead of their real module (e.g. "Module 1: Reading &
// Phonics Foundations") on a subject's level page.
//
// Root cause: the original seed scripts wrote level documents to
// Firestore without a moduleName field — db.json has always had it, but
// the live site reads Firestore first and only falls back to db.json
// when Firestore has zero documents for a subject, so once those
// moduleName-less docs exist, the fallback never kicks in and every
// level's `level.moduleName || 'Standard Lessons'` grouping hits the
// fallback string. This mirrors scripts/backfill_module_names.js but
// runs inside the deployed app (using its own already-configured
// adminDb) instead of needing production credentials copied into a
// local script run.
//
// GET  — dry run: returns the plan (which docs would change) without writing.
// POST — applies that same plan: ONLY sets moduleName on docs where it's
// missing or differs from db.json's current value. Never touches
// isLocked, tasks, or anything else progress-sensitive.
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifySuperAdmin } from '@/lib/verifySuperAdmin';
import { safeErrorResponse } from '@/lib/apiError';
import dbData from '@/app/data/db.json';

// One query per grade+subject (fetches every level doc for that subject
// in a single round trip), not one query per level. The first version of
// this did a separate adminDb.doc(docId).get() for every one of the
// ~1,300 levels across all grades/subjects, sequentially awaited — each
// call's network round trip adds up, and the whole GET blew past
// Netlify's function timeout (observed: a 502 after ~30s with the
// function killed before it could even log an error) long before it
// reached the last grade. Batching to ~60 queries (one per grade+subject
// pair) instead keeps this comfortably under the timeout.
async function computePlan() {
    let checked = 0;
    let missingDoc = 0;
    const toUpdate = [];

    const subjectQueries = [];
    for (const grade of dbData.grades) {
        for (const subject of grade.subjects) {
            subjectQueries.push({ grade, subject });
        }
    }

    const results = await Promise.all(
        subjectQueries.map(({ grade, subject }) =>
            adminDb.collection('levels')
                .where('gradeId', '==', grade.gradeId)
                .where('subjectId', '==', subject.subjectId)
                .get()
                .then((snap) => ({ grade, subject, snap }))
        )
    );

    for (const { grade, subject, snap } of results) {
        const byId = new Map(snap.docs.map((d) => [d.id, d.data()]));
        for (const level of subject.levels) {
            if (!level.moduleName) continue;
            checked++;
            const docId = `${grade.gradeId}_${subject.subjectId}_${level.levelId}`;
            const current = byId.get(docId);
            if (!current) { missingDoc++; continue; }
            if (current.moduleName !== level.moduleName) {
                toUpdate.push({ docId, from: current.moduleName || '(none)', to: level.moduleName });
            }
        }
    }

    return { checked, missingDoc, toUpdate };
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
        const { checked, missingDoc, toUpdate } = await computePlan();
        return NextResponse.json({
            checked,
            missingDoc,
            updateCount: toUpdate.length,
            sample: toUpdate.slice(0, 30),
        });
    } catch (error) {
        return safeErrorResponse('Backfill module names GET error:', error, 'Failed to compute plan.');
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
        const { toUpdate } = await computePlan();

        let batch = adminDb.batch();
        let opsInBatch = 0;
        let written = 0;
        for (const u of toUpdate) {
            batch.update(adminDb.collection('levels').doc(u.docId), { moduleName: u.to });
            opsInBatch++;
            written++;
            if (opsInBatch === 400) {
                await batch.commit();
                batch = adminDb.batch();
                opsInBatch = 0;
            }
        }
        if (opsInBatch > 0) await batch.commit();

        return NextResponse.json({ success: true, written, updatedBy: admin.email });
    } catch (error) {
        return safeErrorResponse('Backfill module names POST error:', error, 'Failed to apply backfill.');
    }
}
