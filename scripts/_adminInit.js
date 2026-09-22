// scripts/_adminInit.js
// Shared Firebase Admin initializer for one-off maintenance scripts.
// Reads credentials from .env.local (or the environment) instead of
// hardcoding them — require this from a script instead of embedding a
// service account object directly.
//
// Usage:
//   const { admin, db } = require('./_adminInit');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function loadEnvLocal() {
    const envPath = path.join(__dirname, '..', '.env.local');
    const env = {};
    if (fs.existsSync(envPath)) {
        fs.readFileSync(envPath, 'utf-8').split('\n').forEach((line) => {
            const eq = line.indexOf('=');
            if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
        });
    }
    return env;
}

const env = loadEnvLocal();
const projectId = env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKeyRaw = env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
    privateKeyRaw = privateKeyRaw.slice(1, -1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
    console.error(
        'Missing Firebase Admin credentials.\n' +
        'Add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY to .env.local\n' +
        '(same values used by src/lib/firebaseAdmin.js).'
    );
    process.exit(1);
}

if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}

module.exports = { admin, db: admin.firestore() };
