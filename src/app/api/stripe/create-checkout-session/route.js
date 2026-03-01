// src/app/api/stripe/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';

// Native Stripe Price IDs per currency
const PRICE_IDS = {
    usd: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
    },
    eur: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_EUR,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID_EUR,
    },
    gbp: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_GBP,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID_GBP,
    },
    nok: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_NOK,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID_NOK,
    },
    sek: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_SEK,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID_SEK,
    },
    dkk: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_DKK,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID_DKK,
    },
};

export async function POST(request) {
    try {
        const { uid, email, billingCycle, currency = 'usd' } = await request.json();

        if (!uid) {
            return NextResponse.json({ error: 'Missing uid.' }, { status: 400 });
        }

        // Pick native price ID; fall back to USD if currency not supported
        const currencyKey = currency.toLowerCase();
        const priceMap = PRICE_IDS[currencyKey] || PRICE_IDS.usd;
        const priceId = billingCycle === 'yearly' ? priceMap.yearly : priceMap.monthly;

        if (!priceId || priceId.startsWith('price_REPLACE')) {
            return NextResponse.json(
                { error: 'Stripe Price IDs are not configured. Run scripts/create-stripe-prices.js first.' },
                { status: 500 }
            );
        }

        const stripe = getStripe();
        let customerId;

        // Look up existing Stripe customer from Firestore
        if (adminDb) {
            const userRef = adminDb.doc(`users/${uid}`);
            const userSnap = await userRef.get();
            const sub = userSnap.data()?.subscription || {};
            customerId = sub.stripeCustomerId;

            if (!customerId) {
                const customer = await stripe.customers.create({
                    email,
                    metadata: { firebaseUid: uid },
                });
                customerId = customer.id;
                await userRef.set({ subscription: { stripeCustomerId: customerId } }, { merge: true });
            }
        } else {
            // Firebase Admin not yet configured — create customer on the fly
            const customer = await stripe.customers.create({
                email,
                metadata: { firebaseUid: uid },
            });
            customerId = customer.id;
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/payment/cancel`,
            metadata: { firebaseUid: uid },
            subscription_data: {
                metadata: { firebaseUid: uid },
                trial_period_days: 30, // 1-month free trial before first charge
            },
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout session error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
