// Server-side super-admin check for API routes that touch sensitive
// resources (Stripe coupons/promotion codes, etc). Mirrors the same two
// checks SuperAdminGuard does client-side — email whitelist, or an active
// role in the 'admins' collection — but verified from the caller's Firebase
// ID token instead of trusted at face value.
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { SUPER_ADMIN_EMAILS } from '@/lib/superAdmin';

export async function verifySuperAdmin(request) {
    if (!adminAuth) return null;

    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const idToken = authHeader.slice('Bearer '.length).trim();
    if (!idToken) return null;

    try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        const email = decoded.email?.toLowerCase();

        if (email && SUPER_ADMIN_EMAILS.includes(email)) {
            return { uid: decoded.uid, email };
        }

        if (adminDb) {
            const adminSnap = await adminDb.doc(`admins/${decoded.uid}`).get();
            if (adminSnap.exists) {
                const data = adminSnap.data();
                if (data.status === 'active' && Array.isArray(data.roles) && data.roles.length > 0) {
                    return { uid: decoded.uid, email, roles: data.roles };
                }
            }
        }

        return null;
    } catch (err) {
        console.error('Super admin verification failed:', err.message);
        return null;
    }
}
