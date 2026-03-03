// src/app/api/dev/seed-billing/route.js
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { getStripe } from '@/lib/stripe';

export async function POST(request) {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development' && process.env.VERCEL_ENV !== 'preview') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    try {
        const { uid } = await request.json();
        if (!uid) return NextResponse.json({ error: 'Missing uid' }, { status: 400 });

        const userRef = adminDb.doc(`users/${uid}`);
        const userSnap = await userRef.get();
        const userData = userSnap.data() || {};

        // 1. Create OR get a real Stripe Customer (so the portal button works)
        const stripe = getStripe();
        let customerId;

        try {
            const customer = await stripe.customers.create({
                email: userData.email || `demo_${uid.slice(0, 5)}@example.com`,
                metadata: { firebaseUid: uid, isDemo: 'true' }
            });
            customerId = customer.id;
        } catch (err) {
            console.error("Stripe customer creation failed in seeder:", err);
            customerId = "cus_demo_" + Math.random().toString(36).substr(2, 9);
        }

        // 1. Create a dummy subscription
        const dummySub = {
            stripeSubscriptionId: "sub_demo_" + Math.random().toString(36).substr(2, 9),
            stripeCustomerId: customerId,
            status: "active",
            plan: "premium_monthly",
            currentPeriodEnd: Timestamp.fromMillis(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days from now
            lastUpdated: Timestamp.now(),
            card: {
                brand: "visa",
                last4: "4242",
                expiry: "12/26"
            }
        };

        await userRef.set({
            subscription: dummySub,
            subscriptionStatus: "active",
            subscriptionPlan: "premium_monthly",
            subscriptionExpiresAt: dummySub.currentPeriodEnd,
            planType: "paid",
        }, { merge: true });

        // 2. Create 3 dummy invoices
        const paymentsRef = adminDb.collection(`users/${uid}/payments`);

        const dummyInvoices = [
            {
                invoiceId: "in_demo_1",
                amountPaid: 29.00,
                currency: "usd",
                status: "paid",
                hostedInvoiceUrl: "https://stripe.com/docs/billing/invoices/sample",
                paymentDate: Timestamp.fromMillis(Date.now() - (5 * 24 * 60 * 60 * 1000)), // 5 days ago
                billingReason: "subscription_create"
            },
            {
                invoiceId: "in_demo_2",
                amountPaid: 29.00,
                currency: "usd",
                status: "paid",
                hostedInvoiceUrl: "https://stripe.com/docs/billing/invoices/sample",
                paymentDate: Timestamp.fromMillis(Date.now() - (35 * 24 * 60 * 60 * 1000)), // 35 days ago
                billingReason: "subscription_cycle"
            },
            {
                invoiceId: "in_demo_3",
                amountPaid: 29.00,
                currency: "usd",
                status: "paid",
                hostedInvoiceUrl: "https://stripe.com/docs/billing/invoices/sample",
                paymentDate: Timestamp.fromMillis(Date.now() - (65 * 24 * 60 * 60 * 1000)), // 65 days ago
                billingReason: "subscription_cycle"
            }
        ];

        const batch = adminDb.batch();
        dummyInvoices.forEach(inv => {
            const docRef = paymentsRef.doc(inv.invoiceId);
            batch.set(docRef, inv);
        });
        await batch.commit();

        return NextResponse.json({ success: true, message: "Demo billing data seeded!" });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
