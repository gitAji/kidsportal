// src/lib/stripe.js
// Server-side Stripe instance (never expose secret key to client)
import Stripe from 'stripe';

let stripeInstance = null;

export function getStripe() {
    if (!stripeInstance) {
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
    }
    return stripeInstance;
}
