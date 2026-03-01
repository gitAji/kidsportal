// src/lib/firebaseAdmin.js
// Firebase Admin SDK — server side only (API routes & webhooks)
// Uses service account credentials stored in environment variables
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function initAdmin() {
    if (getApps().length > 0) return getApps()[0];

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey ||
        clientEmail.startsWith('REPLACE') || privateKey.startsWith('REPLACE')) {
        console.warn(
            '[Firebase Admin] Service account credentials not set.\n' +
            'Go to Firebase Console → Project Settings → Service Accounts → Generate new private key\n' +
            'Then add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY to .env.local'
        );
        // Return null — API routes will handle the missing admin gracefully
        return null;
    }

    return initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
    });
}

const app = initAdmin();
export const adminDb = app ? getFirestore() : null;
