// src/app/api/stripe/verify-session/route.js
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request) {
    try {
        const { sessionId, uid } = await request.json();

        if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'subscription.default_payment_method', 'invoice']
        });

        if (session.payment_status === 'paid' || session.status === 'complete') {
            const subscription = session.subscription;
            const invoice = session.invoice;
            const firebaseUid = uid || session.metadata?.firebaseUid || (typeof subscription !== 'string' ? subscription.metadata?.firebaseUid : null);

            if (firebaseUid && adminDb) {
                const userRef = adminDb.doc(`users/${firebaseUid}`);
                const userSnap = await userRef.get();
                const userData = userSnap.data() || {};

                // 1. Record the payment if we have an invoice
                if (invoice && typeof invoice !== 'string') {
                    const paymentRef = adminDb.collection(`users/${firebaseUid}/payments`).doc(invoice.id);
                    const paymentSnap = await paymentRef.get();

                    if (!paymentSnap.exists) {
                        console.log(`VerifySession: Recording manual payment ${invoice.id}`);
                        await paymentRef.set({
                            invoiceId: invoice.id,
                            amountPaid: invoice.amount_paid / 100,
                            currency: invoice.currency,
                            status: invoice.status,
                            hostedInvoiceUrl: invoice.hosted_invoice_url,
                            paymentDate: Timestamp.now(),
                            subscriptionId: invoice.subscription,
                            billingReason: invoice.billing_reason,
                        });
                    }
                }

                // 2. Force update Firestore if it's lagging (webhook failure backup)
                if (userData.planType !== 'paid') {
                    console.log(`VerifySession: Forcing plan update for user ${firebaseUid}`);

                    const plan = session.metadata?.plan || (typeof subscription !== 'string' ? subscription.metadata?.plan : 'premium_monthly');
                    const pm = typeof subscription !== 'string' ? subscription.default_payment_method : null;
                    let cardData = null;

                    if (pm && typeof pm !== 'string' && pm.card) {
                        cardData = {
                            brand: pm.card.brand,
                            last4: pm.card.last4,
                            expiry: `${pm.card.exp_month}/${pm.card.exp_year}`
                        };
                    }

                    const subData = {
                        stripeSubscriptionId: typeof subscription === 'string' ? subscription : subscription.id,
                        stripeCustomerId: session.customer,
                        status: typeof subscription === 'string' ? 'active' : subscription.status,
                        plan: plan,
                        currentPeriodEnd: typeof subscription !== 'string' ? Timestamp.fromMillis(subscription.current_period_end * 1000) : Timestamp.now(),
                        lastUpdated: Timestamp.now(),
                    };

                    if (cardData) subData.card = cardData;

                    await userRef.set({
                        subscription: subData,
                        subscriptionStatus: subData.status,
                        subscriptionPlan: plan,
                        subscriptionExpiresAt: subData.currentPeriodEnd,
                        planType: 'paid',
                    }, { merge: true });
                }

                return NextResponse.json({ success: true, status: 'paid' });
            }
        }

        return NextResponse.json({ success: false, status: session.payment_status });
    } catch (error) {
        console.error('Verify session error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
