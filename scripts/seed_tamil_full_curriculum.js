const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) env[key.trim()] = val.join('=').trim();
});

const projectId = env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKeyRaw = env.FIREBASE_ADMIN_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
    privateKeyRaw = privateKeyRaw.substring(1, privateKeyRaw.length - 1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

// ─── Helper: shuffle array ────────────────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Helper: create options from correct answer + distractors ─────
function makeOptions(correct, distractors) {
    const pool = distractors.filter(d => String(d) !== String(correct));
    const picked = shuffle(pool).slice(0, 3);
    return shuffle([correct, ...picked]);
}

// ══════════════════════════════════════════════════════════════════
//  LOAD CURRICULUM DATA
// ══════════════════════════════════════════════════════════════════
let curriculum = {};
try {
    curriculum = require('./curriculum_tamil_data.js');
    console.log("✅ Loaded Tamil curriculum data.");
} catch (e) {
    console.log("❌ Failed to load Tamil curriculum data:", e.message);
    process.exit(1);
}

// ══════════════════════════════════════════════════════════════════
//  SEED TO FIRESTORE
// ══════════════════════════════════════════════════════════════════
async function seedToFirestore() {
    console.log("\n🪔 Beginning full TAMIL curriculum upload to Firebase...\n");
    let uploadCount = 0;
    const batchSize = 100;
    let batch = db.batch();
    let currentBatchCount = 0;

    const gradeNums = Object.keys(curriculum).map(Number).sort((a, b) => a - b);

    for (const gradeNum of gradeNums) {
        const gradeId = `grade-${gradeNum}`;
        const subjectId = `tamil-${gradeNum}`;
        const levels = curriculum[gradeNum].levels;

        console.log(`📜 Grade ${gradeNum}: ${levels.length} levels`);

        for (let levelNum = 1; levelNum <= levels.length; levelNum++) {
            const lvl = levels[levelNum - 1];
            const levelId = `${subjectId}-level-${levelNum}`;
            const docId = `${gradeId}_${subjectId}_${levelId}`;

            const tasks = [
                {
                    taskId: `${levelId}-lesson-1`,
                    taskName: `Learn: ${lvl.name}`,
                    type: "lesson",
                    content: lvl.lesson,
                    questions: []
                },
                {
                    taskId: `${levelId}-quiz-1`,
                    taskName: "Practice Quiz",
                    type: "quiz",
                    timeLimit: 180,
                    content: `Let's practice what we learned about ${lvl.name}!`,
                    questions: lvl.quiz.map((item, idx) => {
                        const qType = item.type || "multiple-choice";
                        const qObj = {
                            questionId: `q${idx + 1}-${levelId}`,
                            questionText: item.q,
                            correctAnswer: item.a,
                            type: qType
                        };
                        if (qType !== "identification") {
                            qObj.options = makeOptions(item.a, item.d || []);
                        }
                        return qObj;
                    })
                },
                {
                    taskId: `${levelId}-exam-1`,
                    taskName: "Level Challenge!",
                    type: "exam",
                    timeLimit: 300,
                    content: `Show what you know about ${lvl.name}!`,
                    questions: lvl.exam.map((item, idx) => {
                        const qType = item.type || "multiple-choice";
                        const qObj = {
                            questionId: `ex${idx + 1}-${levelId}`,
                            questionText: item.q,
                            correctAnswer: item.a,
                            type: qType
                        };
                        if (qType !== "identification") {
                            qObj.options = makeOptions(item.a, item.d || []);
                        }
                        return qObj;
                    })
                }
            ];

            const docData = {
                gradeId,
                subjectId,
                levelId,
                levelName: `Level ${levelNum}: ${lvl.name}`,
                isLocked: levelNum > 1,
                tasks,
                updatedAt: FieldValue.serverTimestamp()
            };

            const docRef = db.collection('levels').doc(docId);
            batch.set(docRef, docData, { merge: true });
            currentBatchCount++;
            uploadCount++;

            if (currentBatchCount >= batchSize) {
                await batch.commit();
                console.log(`   ✅ Committed batch of ${batchSize}`);
                batch = db.batch();
                currentBatchCount = 0;
            }
        }
    }

    if (currentBatchCount > 0) {
        await batch.commit();
    }

    console.log(`\n🎉 Upload complete! Pushed ${uploadCount} TAMIL level modules to Firestore.\n`);
}

seedToFirestore().catch(console.error);
