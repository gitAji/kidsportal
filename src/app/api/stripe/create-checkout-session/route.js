// src/app/api/stripe/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import { getVerifiedUid } from '@/lib/verifyAuth';

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

        // Never trust a client-supplied uid — verify it matches the signed-in caller,
        // otherwise anyone could create a Stripe customer linked to someone else's account.
        const verifiedUid = await getVerifiedUid(request);
        if (!verifiedUid || verifiedUid !== uid) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
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
        if (process.env.STRIPE_SECRET_KEY?.includes('REPLACE_WITH_YOUR_SECRET_KEY')) {
            return NextResponse.json({ error: 'Stripe Secret Key is not configured.' }, { status: 500 });
        }
        let customerId;
        let existingTrialEndDate = null;

        // Look up existing Stripe customer from Firestore
        if (adminDb) {
            const userRef = adminDb.doc(`users/${uid}`);
            const userSnap = await userRef.get();
            const userData = userSnap.data() || {};
            const sub = userData.subscription || {};
            customerId = sub.stripeCustomerId;
            existingTrialEndDate = userData.trialEndDate || null;

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

        // Align the first Stripe charge with the trial the user already started
        // at signup instead of always granting a fresh 30-day trial from the
        // moment they add a card. Without this, adding a card late in (or
        // after) the app-level trial pushes the first charge well past the
        // intended "day 31 from signup" — and directly contradicts the
        // checkout copy promising "won't charge you until your trial ends."
        let trialParams = { trial_period_days: 30 };
        if (existingTrialEndDate) {
            const trialEndDate = existingTrialEndDate.toDate
                ? existingTrialEndDate.toDate()
                : new Date(existingTrialEndDate);
            const trialEndUnix = Math.floor(trialEndDate.getTime() / 1000);
            const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600;
            // Trial already lapsed (or ends too soon for Stripe to accept) —
            // charge immediately rather than inventing a new free period.
            trialParams = trialEndUnix > oneHourFromNow ? { trial_end: trialEndUnix } : {};
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/payment/cancel`,
            metadata: {
                firebaseUid: uid,
                plan: billingCycle === 'yearly' ? 'premium_yearly' : 'premium_monthly'
            },
            subscription_data: {
                metadata: {
                    firebaseUid: uid,
                    plan: billingCycle === 'yearly' ? 'premium_yearly' : 'premium_monthly'
                },
                ...trialParams,
            },
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout session error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
