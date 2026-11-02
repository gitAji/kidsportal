// src/app/api/account/delete/route.js
// Self-service "right to erasure" (GDPR Article 17 / COPPA deletion) — a
// parent deleting their own account also deletes every child profile and
// everything tied to it, cancels any active subscription first so deletion
// never leaves an orphaned, still-billing subscription behind, and finally
// removes the Firebase Auth account itself.
import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebaseAdmin';
import { getVerifiedUid } from '@/lib/verifyAuth';
import { getStripe } from '@/lib/stripe';
import { safeErrorResponse } from '@/lib/apiError';

async function deleteQueryResults(query) {
    const snap = await query.get();
    if (snap.empty) return;
    const batch = adminDb.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
}

export async function POST(request) {
    try {
        const verifiedUid = await getVerifiedUid(request);
        if (!verifiedUid) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const userRef = adminDb.doc(`users/${verifiedUid}`);
        const userSnap = await userRef.get();
        const userData = userSnap.exists ? userSnap.data() : {};

        const stripeSubscriptionId = userData?.subscription?.stripeSubscriptionId;
        if (stripeSubscriptionId) {
            try {
                await getStripe().subscriptions.cancel(stripeSubscriptionId);
            } catch (err) {
                // Already canceled/missing on Stripe's side shouldn't block account
                // deletion — the subscription record is being deleted either way.
                console.error('Failed to cancel Stripe subscription during account deletion:', err.message);
            }
        }

        const childrenSnap = await adminDb.collection(`users/${verifiedUid}/children`).get();
        for (const childDoc of childrenSnap.docs) {
            const childId = childDoc.id;
            const childData = childDoc.data();

            await deleteQueryResults(adminDb.collection(`childStats/${childId}/taskHistory`));
            await adminDb.doc(`childStats/${childId}`).delete();
            await deleteQueryResults(adminDb.collection('achievements').where('childId', '==', childId));

            if (childData.username) {
                await adminDb.doc(`child_usernames/${childData.username.toLowerCase()}`).delete().catch(() => { });
            }

            await childDoc.ref.delete();
        }

        await userRef.delete();
        await adminAuth.deleteUser(verifiedUid);

        return NextResponse.json({ success: true });
    } catch (error) {
        return safeErrorResponse('Account deletion error:', error, 'Failed to delete account.');
    }
}
