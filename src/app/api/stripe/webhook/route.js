// src/app/api/stripe/webhook/route.js
// This is the ONLY place subscription status is written to Firestore.
// Stripe calls this endpoint after every payment event.
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

// Helper to find Firebase UID from various possible sources in the Stripe event
async function getFirebaseUid(stripe, event) {
    const obj = event.data.object;

    // 1. Check metadata on the primary object
    if (obj.metadata?.firebaseUid) return obj.metadata.firebaseUid;

    // 2. If it's a subscription-related event, check the subscription
    let subscriptionId = obj.subscription;
    if (obj.object === 'subscription') subscriptionId = obj.id;

    if (subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            if (subscription.metadata?.firebaseUid) return subscription.metadata.firebaseUid;

            // 3. Check the customer on the subscription
            if (subscription.customer) {
                const customer = await stripe.customers.retrieve(subscription.customer);
                if (customer.metadata?.firebaseUid) return customer.metadata.firebaseUid;
            }
        } catch (e) {
            console.error('Error retrieving subscription/customer for UID lookup:', e);
        }
    }

    // 4. Check the customer directly if available on the object
    if (obj.customer) {
        try {
            const customer = await stripe.customers.retrieve(obj.customer);
            if (customer.metadata?.firebaseUid) return customer.metadata.firebaseUid;
        } catch (e) {
            console.error('Error retrieving customer for UID lookup:', e);
        }
    }

    return null;
}

async function updateSubscriptionInFirestore(uid, subscription, plan, cardData = null) {
    if (!uid) {
        console.warn('Webhook: no firebaseUid found, skipping Firestore update.');
        return;
    }
    if (!adminDb) {
        console.error('Webhook: adminDb not initialized. Check your environment variables.');
        return;
    }

    const userRef = adminDb.doc(`users/${uid}`);

    const subscriptionData = {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
        status: subscription.status,
        plan: plan,
        currentPeriodEnd: Timestamp.fromMillis(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        lastUpdated: Timestamp.now(),
    };

    if (cardData) {
        subscriptionData.card = cardData;
    }

    await userRef.set(
        {
            subscription: subscriptionData,
            subscriptionStatus: subscription.status,
            subscriptionPlan: plan,
            subscriptionExpiresAt: Timestamp.fromMillis(subscription.current_period_end * 1000),
            // User requested fields
            planType: 'paid',
        },
        { merge: true }
    );
}

async function recordPaymentInFirestore(uid, invoice) {
    if (!uid || !adminDb) return;

    const paymentData = {
        invoiceId: invoice.id,
        amountPaid: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        paymentDate: Timestamp.now(),
        subscriptionId: invoice.subscription,
        billingReason: invoice.billing_reason,
    };

    await adminDb.collection(`users/${uid}/payments`).doc(invoice.id).set(paymentData);
    await adminDb.doc(`users/${uid}`).set({ lastPayment: paymentData }, { merge: true });
}

export async function POST(request) {
    const stripe = getStripe();
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret.includes('REPLACE_WITH_YOUR_WEBHOOK_SECRET')) {
        console.error('❌ STRIPE_WEBHOOK_SECRET is not configured or is a placeholder.');
        return NextResponse.json({ error: 'Webhook Secret not configured' }, { status: 500 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        console.log('Body snippet:', body.substring(0, 100));
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        const uid = await getFirebaseUid(stripe, event);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                if (session.mode === 'subscription') {
                    const subscription = await stripe.subscriptions.retrieve(session.subscription);
                    let plan = session.metadata?.plan || subscription.metadata?.plan;

                    if (!plan) {
                        const priceId = subscription.items.data[0]?.price?.id;
                        plan = priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ? 'premium_yearly' : 'premium_monthly';
                    }

                    let cardData = null;
                    if (subscription.default_payment_method) {
                        const pm = await stripe.paymentMethods.retrieve(subscription.default_payment_method);
                        if (pm.card) {
                            cardData = {
                                brand: pm.card.brand,
                                last4: pm.card.last4,
                                expiry: `${pm.card.exp_month}/${pm.card.exp_year}`
                            };
                        }
                    }

                    await updateSubscriptionInFirestore(uid, subscription, plan, cardData);
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                const subscriptionId = invoice.subscription;
                console.log(`Webhook: invoice.payment_succeeded for subscription ${subscriptionId}`);

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    await recordPaymentInFirestore(uid, invoice);

                    let plan = subscription.metadata?.plan || 'premium_monthly';
                    await updateSubscriptionInFirestore(uid, subscription, plan);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                console.log(`Webhook: customer.subscription.updated for ${subscription.id}, status: ${subscription.status}`);

                let plan = subscription.metadata?.plan;
                if (!plan) {
                    const priceId = subscription.items.data[0]?.price?.id;
                    plan = priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ? 'premium_yearly' : 'premium_monthly';
                }

                let cardData = null;
                if (subscription.default_payment_method) {
                    const pm = await stripe.paymentMethods.retrieve(subscription.default_payment_method);
                    if (pm.card) {
                        cardData = {
                            brand: pm.card.brand,
                            last4: pm.card.last4,
                            expiry: `${pm.card.exp_month}/${pm.card.exp_year}`
                        };
                    }
                }

                await updateSubscriptionInFirestore(uid, subscription, plan, cardData);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                console.log(`Webhook: customer.subscription.deleted for ${subscription.id}`);
                if (uid && adminDb) {
                    await adminDb.doc(`users/${uid}`).set(
                        {
                            subscription: {
                                status: 'canceled',
                                plan: 'free',
                                cancelAtPeriodEnd: false,
                                stripeSubscriptionId: subscription.id,
                                lastUpdated: Timestamp.now(),
                            },
                            subscriptionStatus: 'canceled',
                            subscriptionPlan: 'free',
                            planType: 'none',
                        },
                        { merge: true }
                    );
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                console.log(`Webhook: invoice.payment_failed for ${invoice.id}`);
                if (uid && adminDb) {
                    // Record the failed payment in history
                    await recordPaymentInFirestore(uid, invoice);

                    await adminDb.doc(`users/${uid}`).set(
                        {
                            subscription: { status: 'past_due' },
                            subscriptionStatus: 'past_due'
                        },
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

