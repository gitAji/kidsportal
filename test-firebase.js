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

console.log("Project:", projectId);
console.log("Email:", clientEmail);
console.log("Private Key starts with:", privateKey?.substring(0, 30));

try {
    const app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
    });
    console.log("App initialized?", !!app);
    const db = getFirestore(app);
    console.log("DB initialized?", !!db);
} catch (err) {
    console.error("initializeApp failed:", err.message);
}
