// scripts/create-stripe-prices.js
// Run once: node scripts/create-stripe-prices.js
// Creates KidsPortal Premium product + native prices in USD, EUR, GBP, NOK, SEK, DKK
// Then prints all price IDs to add to .env.local

const Stripe = require('stripe');

const stripe = Stripe('sk_test_51T67RtDi0VFDCkG8AdEBl9iSzs4IhC50m36SHc3pIIo1kcy8VMdDQh8DgS3x6uBdgKRSsIRwl2ukLXHPICBLIn3I00ZktvyzTy');

// Native prices per currency
// Monthly / Yearly (in smallest currency unit — cents, øre, etc.)
const PRICES = [
    { currency: 'usd', monthly: 549, yearly: 4900 }, // $5.49 / $49
    { currency: 'eur', monthly: 499, yearly: 4499 }, // €4.99 / €44.99
    { currency: 'gbp', monthly: 429, yearly: 3899 }, // £4.29 / £38.99
    { currency: 'nok', monthly: 5900, yearly: 53900 }, // kr 59 / kr 539
    { currency: 'sek', monthly: 5900, yearly: 53900 }, // kr 59 / kr 539
    { currency: 'dkk', monthly: 3900, yearly: 35900 }, // kr 39 / kr 359
];

async function main() {
    console.log('Creating KidsPortal Premium product...');

    const product = await stripe.products.create({
        name: 'KidsPortal Premium',
        description: 'Full access to all grades, unlimited practice sessions & up to 10 child accounts.',
        metadata: { app: 'kidsportal' },
    });

    console.log(`✓ Product created: ${product.id}\n`);

    const results = { monthly: {}, yearly: {} };

    for (const p of PRICES) {
        const monthly = await stripe.prices.create({
            product: product.id,
            unit_amount: p.monthly,
            currency: p.currency,
            recurring: { interval: 'month' },
            nickname: `Premium Monthly (${p.currency.toUpperCase()})`,
        });

        const yearly = await stripe.prices.create({
            product: product.id,
            unit_amount: p.yearly,
            currency: p.currency,
            recurring: { interval: 'year' },
            nickname: `Premium Yearly (${p.currency.toUpperCase()})`,
        });

        results.monthly[p.currency] = monthly.id;
        results.yearly[p.currency] = yearly.id;

        console.log(`✓ ${p.currency.toUpperCase()} — monthly: ${monthly.id}  yearly: ${yearly.id}`);
    }

    console.log('\n✅ Add these to your .env.local:\n');

    // Default (USD)
    console.log(`NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=${results.monthly.usd}`);
    console.log(`NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=${results.yearly.usd}`);

    // Per-currency overrides
    for (const cur of ['eur', 'gbp', 'nok', 'sek', 'dkk']) {
        console.log(`NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_${cur.toUpperCase()}=${results.monthly[cur]}`);
        console.log(`NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID_${cur.toUpperCase()}=${results.yearly[cur]}`);
    }
}

main().catch(console.error);
