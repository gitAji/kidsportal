// ─── Single source of truth for all pricing across the site ──────────────────
// Import this wherever prices need to be displayed or used in checkout.

/**
 * Display prices per currency (monthly / yearly).
 * Native currencies (NOK, SEK, DKK, EUR, GBP, USD) are charged directly by Stripe.
 * All others are displayed for convenience but charged in USD.
 */
export const CURRENCY_PRICES = {
    USD: { symbol: "$", monthly: "$5.49", yearly: "$49", flag: "🇺🇸", name: "US Dollar" },
    EUR: { symbol: "€", monthly: "€4.99", yearly: "€44.99", flag: "🇪🇺", name: "Euro" },
    GBP: { symbol: "£", monthly: "£4.29", yearly: "£38.99", flag: "🇬🇧", name: "British Pound" },
    NOK: { symbol: "kr", monthly: "kr 59", yearly: "kr 539", flag: "🇳🇴", name: "Norwegian Krone" },
    SEK: { symbol: "kr", monthly: "kr 59", yearly: "kr 539", flag: "🇸🇪", name: "Swedish Krona" },
    DKK: { symbol: "kr", monthly: "kr 39", yearly: "kr 359", flag: "🇩🇰", name: "Danish Krone" },
    // Display-only — charged in USD via Stripe
    AED: { symbol: "د.إ", monthly: "د.إ 20.15", yearly: "د.إ 179.95", flag: "🇦🇪", name: "UAE Dirham" },
    AUD: { symbol: "A$", monthly: "A$8.50", yearly: "A$75.90", flag: "🇦🇺", name: "Australian Dollar" },
    CAD: { symbol: "C$", monthly: "C$7.45", yearly: "C$66.70", flag: "🇨🇦", name: "Canadian Dollar" },
    CHF: { symbol: "Fr", monthly: "Fr 4.85", yearly: "Fr 43.10", flag: "🇨🇭", name: "Swiss Franc" },
};

/** Currencies that have dedicated Stripe Price IDs (charged natively). */
export const NATIVE_CURRENCIES = new Set(["USD", "EUR", "GBP", "NOK", "SEK", "DKK"]);

/**
 * Map a country name (as stored in the user's profile) to its currency code.
 * Falls back to USD.
 */
export function countryToCurrency(country = "") {
    const map = {
        Norway: "NOK",
        Sweden: "SEK",
        Denmark: "DKK",
        "United Kingdom": "GBP",
        France: "EUR",
        Germany: "EUR",
        Switzerland: "CHF",
        Finland: "EUR",
        Iceland: "EUR",
        // UAE, Australia, Canada default to display-only
    };
    return map[country] || "USD";
}

/**
 * Return the Stripe currency key (lowercase) to pass to the checkout API.
 * Non-native currencies fall back to "usd" (charged in USD).
 */
export function checkoutCurrency(country = "") {
    const code = countryToCurrency(country);
    return NATIVE_CURRENCIES.has(code) ? code.toLowerCase() : "usd";
}

/**
 * Plan metadata shown on cards / badges.
 */
export const PLAN_META = {
    free_trial: { label: "Free Trial", children: 2, color: "amber" },
    premium_monthly: { label: "Premium Monthly", children: 4, color: "blue" },
    premium_yearly: { label: "Premium Yearly", children: 4, color: "indigo" },
    free: { label: "Free", children: 2, color: "slate" },
};

/** How many child profiles a plan allows. Falls back to the free-trial cap
 * for any plan not in PLAN_META (e.g. no subscription yet). */
export function childLimitForPlan(plan) {
    return PLAN_META[plan]?.children ?? PLAN_META.free_trial.children;
}
