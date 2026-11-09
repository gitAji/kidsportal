// scripts/backfill_module_names.js
//
// Fixes levels showing under the generic "Standard Lessons" group instead
// of their real module (e.g. "Module 1: Reading & Phonics Foundations")
// on a subject's level page. Root cause: the original seed scripts
// (seed_math_full_curriculum.js, seed_english_full_curriculum.js,
// seed_science_full_curriculum.js, seed_tamil_full_curriculum.js,
// seed_english_expert_syllabus.js, seed_uyir_ezhuthukkal_rich.js) wrote
// level documents to Firestore without a moduleName field — db.json has
// always had it, but the live site reads Firestore first and only falls
// back to db.json when Firestore has zero documents for a subject, so
// once those moduleName-less docs exist, the fallback never kicks in and
// every level's `level.moduleName || 'Standard Lessons'` grouping hits
// the fallback string.
//
// This only ever SETS the moduleName field on an existing Firestore level
// doc when it's missing or differs from db.json's current value — it
// never touches isLocked, tasks, or anything else progress-sensitive, so
// it's safe to run against live data.
//
// Usage:
//   node scripts/backfill_module_names.js         # dry run, prints a plan
//   node scripts/backfill_module_names.js --apply # actually writes
//
// Requires FIREBASE_ADMIN_PROJECT_ID / _CLIENT_EMAIL / _PRIVATE_KEY in
// .env.local (the same credentials src/lib/firebaseAdmin.js uses) —
// this repo's cloud sessions don't carry those, so run this from a
// machine that has them.

const { db } = require('./_adminInit');
const dbData = require('../src/app/data/db.json');

const APPLY = process.argv.includes('--apply');

async function main() {
  let checked = 0;
  let toUpdate = [];
  let missingDoc = 0;

  for (const grade of dbData.grades) {
    for (const subject of grade.subjects) {
      for (const level of subject.levels) {
        if (!level.moduleName) continue; // nothing to backfill from
        checked++;
        const docId = `${grade.gradeId}_${subject.subjectId}_${level.levelId}`;
        const snap = await db.collection('levels').doc(docId).get();
        if (!snap.exists) { missingDoc++; continue; }
        const current = snap.data();
        if (current.moduleName !== level.moduleName) {
          toUpdate.push({ docId, from: current.moduleName || '(none)', to: level.moduleName });
        }
      }
    }
  }

  console.log(`Checked ${checked} levels with a moduleName in db.json.`);
  console.log(`${missingDoc} have no matching Firestore doc (fine — those already use the db.json fallback).`);
  console.log(`${toUpdate.length} Firestore docs need their moduleName set/corrected.`);

  if (toUpdate.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  if (!APPLY) {
    console.log('\nDry run — first 20 planned updates:');
    toUpdate.slice(0, 20).forEach((u) => console.log(`  ${u.docId}: "${u.from}" -> "${u.to}"`));
    console.log('\nRe-run with --apply to write these.');
    return;
  }

  console.log('\nApplying...');
  let batch = db.batch();
  let opsInBatch = 0;
  let written = 0;
  for (const u of toUpdate) {
    batch.update(db.collection('levels').doc(u.docId), { moduleName: u.to });
    opsInBatch++;
    written++;
    if (opsInBatch === 400) {
      await batch.commit();
      batch = db.batch();
      opsInBatch = 0;
      console.log(`  committed ${written}/${toUpdate.length}...`);
    }
  }
  if (opsInBatch > 0) await batch.commit();
  console.log(`Done — updated ${written} level documents.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
