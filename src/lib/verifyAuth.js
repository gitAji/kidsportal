// src/lib/verifyAuth.js
// Verifies the Firebase ID token sent by the client in the Authorization header,
// so payment API routes never trust a client-supplied uid at face value.
import { adminAuth } from '@/lib/firebaseAdmin';

/**
 * Returns the verified Firebase uid from the request's "Authorization: Bearer <idToken>"
 * header, or null if missing/invalid/expired.
 */
export async function getVerifiedUid(request) {
    if (!adminAuth) return null;

    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const idToken = authHeader.slice('Bearer '.length).trim();
    if (!idToken) return null;

    try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        return decoded.uid;
    } catch (err) {
        console.error('ID token verification failed:', err.message);
        return null;
    }
}
