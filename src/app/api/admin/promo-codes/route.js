// src/app/api/admin/promo-codes/route.js
// Super-admin-only: list and create Stripe promotion codes. Checkout
// already has allow_promotion_codes: true (see create-checkout-session),
// so any code created here works immediately at Stripe Checkout with no
// further integration — Stripe itself enforces expiry and redemption caps.
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { verifySuperAdmin } from '@/lib/verifySuperAdmin';

export async function GET(request) {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    try {
        const stripe = getStripe();
        const list = await stripe.promotionCodes.list({ limit: 100 });

        const codes = await Promise.all(list.data.map(async (pc) => {
            const coupon = typeof pc.coupon === 'string'
                ? await stripe.coupons.retrieve(pc.coupon)
                : pc.coupon;
            return {
                id: pc.id,
                code: pc.code,
                active: pc.active,
                timesRedeemed: pc.times_redeemed,
                maxRedemptions: pc.max_redemptions,
                expiresAt: pc.expires_at,
                percentOff: coupon.percent_off,
                duration: coupon.duration,
                durationInMonths: coupon.duration_in_months,
                createdAt: pc.created,
            };
        }));

        codes.sort((a, b) => b.createdAt - a.createdAt);
        return NextResponse.json({ codes });
    } catch (error) {
        console.error('List promo codes error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    try {
        const { code, percentOff = 100, duration = 'forever', durationInMonths, maxRedemptions, expiresAt } = await request.json();

        if (!code || typeof code !== 'string' || !code.trim()) {
            return NextResponse.json({ error: 'A promo code is required.' }, { status: 400 });
        }
        const pct = Number(percentOff);
        if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
            return NextResponse.json({ error: 'Percent off must be between 1 and 100.' }, { status: 400 });
        }
        if (!['forever', 'once', 'repeating'].includes(duration)) {
            return NextResponse.json({ error: 'Invalid duration.' }, { status: 400 });
        }
        if (duration === 'repeating' && (!durationInMonths || Number(durationInMonths) < 1)) {
            return NextResponse.json({ error: 'Repeating discounts need a number of months.' }, { status: 400 });
        }
        if (maxRedemptions !== undefined && maxRedemptions !== null && maxRedemptions !== '' && Number(maxRedemptions) < 1) {
            return NextResponse.json({ error: 'Max redemptions must be at least 1.' }, { status: 400 });
        }

        const stripe = getStripe();
        if (process.env.STRIPE_SECRET_KEY?.includes('REPLACE_WITH_YOUR_SECRET_KEY')) {
            return NextResponse.json({ error: 'Stripe Secret Key is not configured.' }, { status: 500 });
        }

        const couponParams = {
            percent_off: pct,
            duration,
            name: `KidsPortal promo: ${code.trim().toUpperCase()}`,
        };
        if (duration === 'repeating') couponParams.duration_in_months = Number(durationInMonths);

        const coupon = await stripe.coupons.create(couponParams);

        const promoParams = {
            coupon: coupon.id,
            code: code.trim().toUpperCase(),
            active: true,
            metadata: { createdByEmail: admin.email || '', app: 'kidsportal' },
        };
        if (maxRedemptions) promoParams.max_redemptions = Number(maxRedemptions);
        if (expiresAt) {
            const ts = Math.floor(new Date(expiresAt).getTime() / 1000);
            if (Number.isFinite(ts) && ts > Date.now() / 1000) promoParams.expires_at = ts;
        }

        const promotionCode = await stripe.promotionCodes.create(promoParams);

        return NextResponse.json({
            id: promotionCode.id,
            code: promotionCode.code,
            couponId: coupon.id,
        });
    } catch (error) {
        console.error('Create promo code error:', error);
        const message = /already exists/i.test(error.message || '')
            ? 'That code already exists. Choose a different one.'
            : (error.message || 'Failed to create promo code.');
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
