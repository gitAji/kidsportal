// Single source of truth for turning a Firestore `users/{uid}` doc into a
// normalized subscription view: { plan, status, currentPeriodEnd, ... }.
//
// Every call site used to hand-roll its own "is the trial still active"
// check against trialEndDate, then spread the raw `subscription` object
// back on top "to keep stripeCustomerId" — which also brought back
// `subscription.status`, a field that's written once at signup as
// 'active' and never updated again for a card-less trial. That silently
// undid the expiry check that was just computed, so an expired trial kept
// showing as "Active" with no upgrade prompt (and, via useSubscription(),
// kept granting access to premium content) no matter how long ago it
// actually lapsed. Route every trial-status read through here instead.
export function resolveSubscription(userData) {
    if (!userData) return null;

    const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null);

    if (userData.planType === 'paid') {
        const sub = userData.subscription || {};
        return {
            ...sub,
            status: userData.subscriptionStatus || sub.status || 'inactive',
            plan: userData.subscriptionPlan || sub.plan,
            currentPeriodEnd: toDate(userData.subscriptionExpiresAt || sub.currentPeriodEnd),
        };
    }

    // Free trial (or any legacy account with no explicit paid plan) —
    // status is ALWAYS derived from trialEndDate vs. now. Never trust a
    // stored `status` field here: nothing updates it after signup.
    const trialEnd = toDate(userData.trialEndDate) || (() => {
        const base = toDate(userData.createdAt) || new Date();
        const d = new Date(base);
        d.setMonth(d.getMonth() + 1);
        return d;
    })();

    return {
        plan: 'trial',
        status: trialEnd > new Date() ? 'active' : 'expired',
        currentPeriodEnd: trialEnd,
        stripeCustomerId: userData.subscription?.stripeCustomerId || null,
        card: userData.subscription?.card || null,
    };
}
