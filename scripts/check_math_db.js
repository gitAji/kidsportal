const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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

async function checkDb() {
    console.log("Checking Math levels in Firestore...");
    const snapshot = await db.collection('levels').get();

    // Filter math in memory since 'subjectId' has different formats like math-7
    const mathDocs = snapshot.docs.filter(doc => doc.data().subjectId && doc.data().subjectId.startsWith('math-'));

    console.log(`\nFound ${mathDocs.length} Math levels in the database!`);

    if (mathDocs.length > 0) {
        console.log("\nSample Math Level from Grade 7:");
        const grade7Levels = mathDocs.filter(doc => doc.data().gradeId === 'grade-7');
        if (grade7Levels.length > 0) {
            const sample = grade7Levels[0].data();
            console.log(`- Document ID: ${grade7Levels[0].id}`);
            console.log(`- Level ID: ${sample.levelId}`);
            console.log(`- Level Name: ${sample.levelName}`);
            console.log(`- Tasks count: ${sample.tasks.length} (Lesson, Quiz, Exam)`);
            console.log(`- Sample Lesson: "${sample.tasks[0].content.substring(0, 100)}..."`);
        } else {
            console.log("No Grade 7 Math levels found (Wait, did they seed?).");
        }
    }
}

checkDb().catch(console.error);
