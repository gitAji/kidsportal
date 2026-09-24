// src/app/api/admin/promo-codes/[id]/route.js
// Super-admin-only: toggle a promotion code active/inactive. This is the
// "kill switch" for a code that leaked publicly — Stripe promotion codes
// can't be deleted, only deactivated, which immediately stops new
// redemptions without affecting anyone already subscribed through it.
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { verifySuperAdmin } from '@/lib/verifySuperAdmin';

export async function PATCH(request, { params }) {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { active } = await request.json();
        if (typeof active !== 'boolean') {
            return NextResponse.json({ error: '"active" must be true or false.' }, { status: 400 });
        }

        const stripe = getStripe();
        const updated = await stripe.promotionCodes.update(id, { active });
        return NextResponse.json({ id: updated.id, active: updated.active });
    } catch (error) {
        console.error('Update promo code error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update promo code.' }, { status: 500 });
    }
}
