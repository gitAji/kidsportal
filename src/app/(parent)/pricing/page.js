"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck, FaStar, FaRocket, FaShieldAlt,
  FaSpinner, FaGlobe, FaChevronDown, FaLock,
  FaUserShield, FaCcStripe
} from "react-icons/fa";
import { SiStripe } from "react-icons/si";

import { CURRENCY_PRICES, NATIVE_CURRENCIES } from "@/lib/pricingConfig";

// ─── Currency Selector ────────────────────────────────────────────────────────
function CurrencySelector({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const cur = CURRENCY_PRICES[selected];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md transition-all"
      >
        <FaGlobe className="text-blue-500" />
        <span>{cur.flag} {selected}</span>
        <FaChevronDown className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="max-h-72 overflow-y-auto scrollbar-hide py-2">
              {Object.entries(CURRENCY_PRICES).map(([code, c]) => (
                <button
                  key={code}
                  onClick={() => { onChange(code); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors ${selected === code ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700"
                    }`}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="font-semibold w-10 flex-shrink-0">{code}</span>
                  <span className="text-slate-400">{c.name}</span>
                  {!NATIVE_CURRENCIES.has(code) && (
                    <span className="ml-auto text-xs text-slate-300">~USD</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const router = useRouter();

  const currency = CURRENCY_PRICES[currencyCode];
  const monthlyDisplay = currency.monthly;
  const yearlyDisplay = currency.yearly;

  const plans = [
    {
      name: "Free Trial",
      icon: <FaShieldAlt className="text-slate-400 text-3xl" />,
      price: "Free",
      period: "for 1 month",
      tagline: "Try out our platform",
      features: [
        "Access to selected grades & subjects",
        "Basic practice sessions",
        "Up to 2 children accounts",
        "Standard support",
        "Trial expires after 30 days",
      ],
      isFree: true,
    },
    {
      name: "Premium",
      icon: <FaRocket className="text-cyan-400 text-3xl" />,
      price: billingCycle === "monthly" ? monthlyDisplay : yearlyDisplay,
      period: billingCycle === "monthly" ? "/month" : "/year",
      tagline: "Everything your family needs",
      features: [
        "Full access to all grades & subjects",
        "Unlimited practice sessions",
        "Detailed progress & analytics",
        "Up to 4 children accounts",
        "Priority support",
        "Exclusive premium content",
      ],
      isFree: false,
    },
  ];

  const handleChoosePlan = async () => {
    if (!auth.currentUser) {
      router.push("/login?role=parent&redirect=" + encodeURIComponent("/pricing"));
      return;
    }

    setCheckoutError(null);
    setLoadingPlan("Premium");
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          billingCycle,
          // Use native currency if supported, otherwise Stripe charges USD
          currency: NATIVE_CURRENCIES.has(currencyCode) ? currencyCode : "USD",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe error:", data.error);
        setCheckoutError("We couldn't start checkout. Please try again in a moment.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError("We couldn't start checkout. Please check your connection and try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

      <main className="flex-grow px-4 py-16 flex flex-col items-center justify-center relative z-10">

        {/* Header + currency picker row */}
        <div className="w-full max-w-3xl flex items-start justify-between mb-8 flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full shadow-sm mb-3">
              <FaStar className="text-yellow-400" /> Simple Pricing
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              Choose Your Learning
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Adventure</span>
            </h1>
            <p className="text-slate-500 mt-2">
              Showing prices in{" "}
              <span className="font-bold text-slate-700">{currency.flag} {currency.name}</span>
              {!NATIVE_CURRENCIES.has(currencyCode) && (
                <span className="text-slate-400 text-sm ml-1">(indicative · charged in USD)</span>
              )}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex-shrink-0 pt-1">
            <CurrencySelector selected={currencyCode} onChange={setCurrencyCode} />
          </motion.div>
        </div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-full p-1.5 shadow-md mb-6"
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${billingCycle === "monthly"
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${billingCycle === "yearly"
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            Yearly
            <span className="bg-lime-100 text-lime-600 text-xs font-bold px-2 py-0.5 rounded-full">Save ~26%</span>
          </button>
        </motion.div>

        {/* Yearly savings note */}
        <AnimatePresence>
          {billingCycle === "yearly" && (
            <motion.p
              key="yearly-note"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="text-sm text-emerald-600 font-semibold mb-6 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100"
            >
              🎉 Yearly plan — best value! Pay once, learn all year.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border flex flex-col justify-between ${!plan.isFree ? "border-blue-300 ring-2 ring-blue-400/30" : "border-slate-200"
                }`}
            >
              {!plan.isFree && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow whitespace-nowrap">
                  ✦ Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-5">
                  {plan.icon}
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">{plan.name}</h2>
                    <p className="text-slate-400 text-sm">{plan.tagline}</p>
                  </div>
                </div>

                {/* Price — animates on currency/billing change */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${plan.name}-${currencyCode}-${billingCycle}`}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="mb-6 flex items-end gap-1"
                  >
                    <span className="text-5xl font-black text-slate-800">{plan.price}</span>
                    <span className="text-slate-400 text-sm mb-1.5">{plan.period}</span>
                  </motion.div>
                </AnimatePresence>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${!plan.isFree ? "bg-cyan-100 text-cyan-600" : "bg-slate-100 text-slate-500"
                        }`}>
                        <FaCheck />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {plan.isFree ? (
                <button
                  onClick={() => router.push('/register')}
                  className="w-full bg-slate-100 text-slate-600 py-3 px-6 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Start Free Trial
                </button>
              ) : (
                <button
                  onClick={handleChoosePlan}
                  disabled={loadingPlan === "Premium"}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-wait text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loadingPlan === "Premium" ? (
                    <><FaSpinner className="animate-spin" /> Redirecting to Stripe...</>
                  ) : (
                    <>Get Premium · {plan.price}{plan.period}</>
                  )}
                </button>
              )}
              {!plan.isFree && checkoutError && (
                <p className="text-rose-600 text-xs font-semibold text-center mt-3">{checkoutError}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Trust Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        >
          <div className="flex items-center gap-2 group cursor-default">
            <SiStripe className="text-3xl text-slate-600 group-hover:text-[#635BFF] transition-colors" />
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Powered by</p>
              <p className="text-sm font-black text-slate-800 leading-none mt-1">Stripe</p>
            </div>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
            <FaLock className="text-xl text-slate-600 group-hover:text-green-600 transition-colors" />
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Secure</p>
              <p className="text-sm font-black text-slate-800 leading-none mt-1">SSL Encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
            <FaUserShield className="text-2xl text-slate-600 group-hover:text-blue-600 transition-colors" />
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Privacy</p>
              <p className="text-sm font-black text-slate-800 leading-none mt-1">PCI-DSS Ready</p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-10 text-slate-400 text-[10px] font-bold text-center max-w-md uppercase tracking-wider"
        >
          Guaranteed Safe Checkout · Cancel Anytime with One Click
          {!NATIVE_CURRENCIES.has(currencyCode) && <span className="block mt-1 font-medium italic opacity-70">Indicative prices — card charged in USD.</span>}
        </motion.p>

        {/* ── Membership disclosure + guarantee ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 max-w-xl w-full flex flex-col items-center gap-4"
        >
          <p className="text-slate-500 text-xs sm:text-sm text-center font-medium leading-relaxed">
            Your membership will be renewed automatically. You can cancel online anytime. Sales tax may apply.
          </p>

          <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-5 flex items-start gap-4 text-left">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FaShieldAlt />
            </div>
            <div>
              <p className="font-black text-emerald-800 text-sm mb-1">Our guarantee</p>
              <p className="text-emerald-700/80 text-sm font-medium leading-relaxed">
                If you're not satisfied within 30 days, we'll gladly provide a full refund.
              </p>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
