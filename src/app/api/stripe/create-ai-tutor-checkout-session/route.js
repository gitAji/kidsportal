// src/app/api/stripe/create-ai-tutor-checkout-session/route.js
// Separate $25/month add-on subscription that unlocks the AI Tutor
// Assistant, independent of (and billed alongside) the main Premium plan.
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import { getVerifiedUid } from '@/lib/verifyAuth';
import { safeErrorResponse } from '@/lib/apiError';

export async function POST(request) {
    try {
        const { uid, email } = await request.json();

        if (!uid) {
            return NextResponse.json({ error: 'Missing uid.' }, { status: 400 });
        }

        // Never trust a client-supplied uid — verify it matches the signed-in caller.
        const verifiedUid = await getVerifiedUid(request);
        if (!verifiedUid || verifiedUid !== uid) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const priceId = process.env.NEXT_PUBLIC_STRIPE_AI_TUTOR_PRICE_ID;
        if (!priceId || priceId.startsWith('price_REPLACE')) {
            return NextResponse.json(
                { error: 'AI Tutor Pack price is not configured. Run scripts/create-stripe-prices.js first.' },
                { status: 500 }
            );
        }

        const stripe = getStripe();
        if (process.env.STRIPE_SECRET_KEY?.includes('REPLACE_WITH_YOUR_SECRET_KEY')) {
            return NextResponse.json({ error: 'Stripe Secret Key is not configured.' }, { status: 500 });
        }

        let customerId;
        if (adminDb) {
            const userRef = adminDb.doc(`users/${uid}`);
            const userSnap = await userRef.get();
            const userData = userSnap.data() || {};
            customerId = userData.subscription?.stripeCustomerId || userData.aiTutorPack?.stripeCustomerId;

            if (!customerId) {
                const customer = await stripe.customers.create({
                    email,
                    metadata: { firebaseUid: uid },
                });
                customerId = customer.id;
                await userRef.set({ subscription: { stripeCustomerId: customerId } }, { merge: true });
            }
        } else {
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
            cancel_url: `${baseUrl}/pricing`,
            metadata: { firebaseUid: uid, plan: 'ai_tutor_pack' },
            subscription_data: {
                metadata: { firebaseUid: uid, plan: 'ai_tutor_pack' },
            },
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        return safeErrorResponse('AI Tutor Pack checkout session error:', error, 'Failed to start checkout.');
    }
}
