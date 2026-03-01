// src/app/api/stripe/create-portal-session/route.js
// Lets users manage their subscription (cancel, upgrade, view invoices)
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request) {
    try {
        const { uid } = await request.json();

        if (!uid) {
            return NextResponse.json({ error: 'Missing uid.' }, { status: 400 });
        }

        const userRef = adminDb.doc(`users/${uid}`);
        const userSnap = await userRef.get();
        const subscription = userSnap.data()?.subscription || {};

        const customerId = subscription.stripeCustomerId;
        if (!customerId) {
            return NextResponse.json({ error: 'No Stripe customer found.' }, { status: 404 });
        }

        const stripe = getStripe();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${baseUrl}/dashboard`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Stripe portal session error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
