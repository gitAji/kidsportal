// src/app/api/stripe/webhook/route.js
// This is the ONLY place subscription status is written to Firestore.
// Stripe calls this endpoint after every payment event.
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

// Must disable body parsing — Stripe needs the raw body for signature verification
export const config = { api: { bodyParser: false } };

async function updateSubscriptionInFirestore(uid, subscription, plan) {
    if (!uid) {
        console.warn('Webhook: no firebaseUid found in metadata, skipping Firestore update.');
        return;
    }

    const userRef = adminDb.doc(`users/${uid}`);
    await userRef.set(
        {
            subscription: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer,
                status: subscription.status, // active | canceled | past_due | trialing | incomplete
                plan: plan,
                currentPeriodEnd: Timestamp.fromMillis(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
        },
        { merge: true }
    );
}

export async function POST(request) {
    const stripe = getStripe();
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const uid = session.metadata?.firebaseUid;

                if (session.mode === 'subscription') {
                    // Retrieve full subscription object
                    const subscription = await stripe.subscriptions.retrieve(session.subscription);
                    const priceId = subscription.items.data[0]?.price?.id;

                    let plan = 'premium_monthly';
                    if (priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID) {
                        plan = 'premium_yearly';
                    }

                    await updateSubscriptionInFirestore(uid, subscription, plan);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const uid = subscription.metadata?.firebaseUid;
                const priceId = subscription.items.data[0]?.price?.id;

                let plan = 'premium_monthly';
                if (priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID) {
                    plan = 'premium_yearly';
                }

                await updateSubscriptionInFirestore(uid, subscription, plan);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const uid = subscription.metadata?.firebaseUid;

                if (uid) {
                    await adminDb.doc(`users/${uid}`).set(
                        {
                            subscription: {
                                status: 'canceled',
                                plan: 'free',
                                cancelAtPeriodEnd: false,
                                stripeSubscriptionId: subscription.id,
                            },
                        },
                        { merge: true }
                    );
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
                const uid = subscription.metadata?.firebaseUid;

                if (uid) {
                    await adminDb.doc(`users/${uid}`).set(
                        { subscription: { status: 'past_due' } },
                        { merge: true }
                    );
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
    }
}
