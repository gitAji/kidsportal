// src/app/api/stripe/sync/route.js
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { getVerifiedUid } from '@/lib/verifyAuth';

export async function POST(request) {
    try {
        const { uid } = await request.json();
        if (!uid) return NextResponse.json({ error: 'Missing uid' }, { status: 400 });

        // Prevents pulling (and overwriting Firestore with) another user's Stripe data.
        const verifiedUid = await getVerifiedUid(request);
        if (!verifiedUid || verifiedUid !== uid) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const stripe = getStripe();
        const userRef = adminDb.doc(`users/${uid}`);
        const userSnap = await userRef.get();
        const userData = userSnap.data() || {};

        const customerId = userData.subscription?.stripeCustomerId;
        if (!customerId) {
            return NextResponse.json({ error: 'No Stripe customer linked to this account.' }, { status: 404 });
        }

        // 1. Fetch latest Subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
            limit: 1,
            expand: ['data.default_payment_method']
        });

        const sub = subscriptions.data[0];
        let subData = null;

        if (sub) {
            const pm = sub.default_payment_method;
            subData = {
                stripeSubscriptionId: sub.id,
                stripeCustomerId: customerId,
                status: sub.status,
                plan: sub.metadata?.plan || (sub.items.data[0].price.id === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ? 'premium_yearly' : 'premium_monthly'),
                currentPeriodEnd: Timestamp.fromMillis(sub.current_period_end * 1000),
                cancelAtPeriodEnd: sub.cancel_at_period_end,
                lastUpdated: Timestamp.now(),
            };

            if (pm && typeof pm !== 'string' && pm.card) {
                subData.card = {
                    brand: pm.card.brand,
                    last4: pm.card.last4,
                    expiry: `${pm.card.exp_month}/${pm.card.exp_year}`
                };
            }

            // Sync Main Profile
            await userRef.set({
                subscription: subData,
                subscriptionStatus: sub.status,
                subscriptionPlan: subData.plan,
                subscriptionExpiresAt: subData.currentPeriodEnd,
                planType: sub.status === 'active' || sub.status === 'trialing' ? 'paid' : 'none',
            }, { merge: true });
        }

        // 2. Fetch latest 5 Invoices
        const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 5,
        });

        const batch = adminDb.batch();
        for (const inv of invoices.data) {
            const invRef = adminDb.collection(`users/${uid}/payments`).doc(inv.id);
            batch.set(invRef, {
                invoiceId: inv.id,
                amountPaid: inv.amount_paid / 100,
                currency: inv.currency,
                status: inv.status,
                hostedInvoiceUrl: inv.hosted_invoice_url,
                paymentDate: Timestamp.fromMillis(inv.status_transitions.paid_at ? inv.status_transitions.paid_at * 1000 : Date.now()),
                subscriptionId: inv.subscription,
                billingReason: inv.billing_reason,
            }, { merge: true });
        }
        await batch.commit();

        return NextResponse.json({ success: true, subData });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
