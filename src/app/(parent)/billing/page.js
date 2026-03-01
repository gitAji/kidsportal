"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import {
    FaCreditCard, FaCrown, FaCalendarAlt,
    FaSyncAlt, FaCheckCircle, FaSpinner,
    FaExclamationTriangle, FaShieldAlt, FaLock
} from "react-icons/fa";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";

// ── Helpers ────────────────────────────────────────────────────────
function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function daysLeft(ts) {
    if (!ts) return null;
    const end = ts.toDate ? ts.toDate() : new Date(ts);
    return Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
}

function getPlanInfo(plan) {
    switch (plan) {
        case "premium_monthly":
            return { label: "Premium Monthly", cycle: "Monthly", children: 5, color: "blue" };
        case "premium_yearly":
            return { label: "Premium Yearly", cycle: "Yearly", children: 5, color: "indigo" };
        case "trial":
            return { label: "Free Trial", cycle: "Trial", children: 2, color: "amber" };
        default:
            return { label: "Free", cycle: "—", children: 2, color: "slate" };
    }
}

const PALETTE = {
    blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-100", badge: "bg-blue-100 text-blue-600" },
    indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50", border: "border-indigo-100", badge: "bg-indigo-100 text-indigo-600" },
    amber: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-100", badge: "bg-amber-100 text-amber-600" },
    slate: { bg: "bg-slate-700", text: "text-slate-600", light: "bg-slate-50", border: "border-slate-100", badge: "bg-slate-100 text-slate-500" },
};

// ── Row component ──────────────────────────────────────────────────
function BillingRow({ icon, label, value, valueClass = "text-slate-800" }) {
    return (
        <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
                <span className="text-slate-300 text-sm">{icon}</span>
                <span className="text-sm text-slate-500 font-medium">{label}</span>
            </div>
            <span className={`text-sm font-black ${valueClass}`}>{value}</span>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────
export default function BillingPage() {
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [portalLoading, setPortalLoading] = useState(false);
    const [portalError, setPortalError] = useState("");

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) { setLoading(false); return; }

            const ref = doc(db, "users", user.uid);
            const unsubSnap = onSnapshot(ref, (snap) => {
                const data = snap.data() || {};
                const createdAt = data.createdAt?.toDate
                    ? data.createdAt.toDate()
                    : data.createdAt ? new Date(data.createdAt) : null;

                if (!data.subscription) {
                    // Default 1-month trial
                    const base = createdAt || new Date();
                    const trialEnd = new Date(base);
                    trialEnd.setMonth(trialEnd.getMonth() + 1);
                    setSub({
                        plan: "trial",
                        status: trialEnd > new Date() ? "active" : "expired",
                        currentPeriodEnd: trialEnd,
                        card: null,
                    });
                } else {
                    setSub(data.subscription);
                }
                setLoading(false);
            });
            return () => unsubSnap();
        });
        return () => unsubAuth();
    }, []);

    const openPortal = async () => {
        setPortalLoading(true);
        setPortalError("");
        try {
            const res = await fetch("/api/stripe/create-portal-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: auth.currentUser?.uid }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else setPortalError(data.error || "Could not open billing portal.");
        } catch {
            setPortalError("Network error. Please try again.");
        } finally {
            setPortalLoading(false);
        }
    };

    if (loading) return <DashboardSkeleton />;

    const planInfo = getPlanInfo(sub?.plan);
    const palette = PALETTE[planInfo.color];
    const isPaid = ["premium_monthly", "premium_yearly"].includes(sub?.plan);
    const isTrial = sub?.plan === "trial";
    const isActive = sub?.status === "active";
    const isExpired = sub?.status === "expired";
    const days = daysLeft(sub?.currentPeriodEnd);

    // Card display
    const cardBrand = sub?.card?.brand || sub?.cardBrand || null;
    const cardLast4 = sub?.card?.last4 || sub?.cardLast4 || null;
    const cardExpiry = sub?.card?.expiry || sub?.cardExpiry || null;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Page Header ── */}
            <div className="bg-white border-b border-slate-100 px-8 py-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">Welcome to Billing</h1>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">Manage your family&apos;s subscription and payment methods</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">

                {/* ── Plan Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    {/* Coloured accent bar */}
                    <div className={`h-1.5 w-full ${palette.bg}`} />

                    <div className="p-6">
                        {/* Plan header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${palette.light} border ${palette.border} rounded-2xl flex items-center justify-center ${palette.text} text-xl`}>
                                    <FaCrown />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-slate-800">{planInfo.label}</h2>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Up to {planInfo.children} children accounts</p>
                                </div>
                            </div>

                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isActive && isPaid ? "bg-green-100 text-green-600" :
                                isActive && isTrial ? "bg-amber-100 text-amber-600" :
                                    isExpired ? "bg-red-100 text-red-500" :
                                        "bg-slate-100 text-slate-400"
                                }`}>
                                {isExpired ? "Expired" : isActive ? "Active" : sub?.status || "—"}
                            </span>
                        </div>

                        {/* Billing rows */}
                        <div className="divide-y divide-slate-50">
                            <BillingRow
                                icon={<FaSyncAlt />}
                                label="Billing cycle"
                                value={planInfo.cycle}
                            />
                            <BillingRow
                                icon={<FaCalendarAlt />}
                                label={isPaid && isActive ? (planInfo.cycle === "Yearly" ? "Renews on" : "Next payment") : "Expires on"}
                                value={formatDate(sub?.currentPeriodEnd)}
                                valueClass={isExpired ? "text-red-500" : "text-slate-800"}
                            />
                            {isPaid && (
                                <BillingRow
                                    icon={<FaCheckCircle />}
                                    label="Status"
                                    value={isActive ? "Subscription active" : "Subscription inactive"}
                                    valueClass={isActive ? "text-green-600" : "text-red-500"}
                                />
                            )}
                        </div>

                        {/* Trial expiry warning */}
                        {isTrial && isActive && days !== null && days <= 10 && (
                            <div className="mt-4 flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold text-amber-600">
                                <FaExclamationTriangle className="flex-shrink-0" />
                                Your free trial expires in {days} day{days !== 1 ? "s" : ""}. Upgrade to keep access.
                            </div>
                        )}

                        {isExpired && (
                            <div className="mt-4 flex items-center gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-500">
                                <FaExclamationTriangle className="flex-shrink-0" />
                                Your plan has expired. Upgrade to restore full access.
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── Payment Method ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50">
                        <FaCreditCard className="text-blue-400 text-base" />
                        <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider">Payment Method</h2>
                    </div>

                    <div className="p-6">
                        {cardLast4 ? (
                            <div className="flex items-center gap-5">
                                {/* Card art */}
                                <div className="w-16 h-10 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-end pb-1.5 px-2 shadow-md flex-shrink-0">
                                    <div className="flex gap-0.5">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="w-1 h-1 rounded-full bg-white/40" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-black text-slate-800 capitalize">
                                        {cardBrand || "Card"} ending in {cardLast4}
                                    </p>
                                    {cardExpiry && (
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">Expires {cardExpiry}</p>
                                    )}
                                </div>
                                {isPaid && (
                                    <button
                                        onClick={openPortal}
                                        disabled={portalLoading}
                                        className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
                                    >
                                        Update
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <FaLock className="text-slate-300 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-500">No card on file</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">A card will be required when you upgrade</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── Action Buttons ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 }}
                    className="space-y-3"
                >
                    {/* Primary CTA */}
                    {isPaid && isActive ? (
                        <button
                            onClick={openPortal}
                            disabled={portalLoading}
                            className="w-full py-3.5 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-blue-100"
                        >
                            {portalLoading
                                ? <><FaSpinner className="animate-spin" /> Opening portal…</>
                                : <><FaCreditCard /> Manage Billing on Stripe</>}
                        </button>
                    ) : (
                        <a
                            href="/pricing"
                            className="w-full py-3.5 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100 block text-center"
                        >
                            {isExpired ? "Renew Subscription" : "Upgrade Plan"}
                        </a>
                    )}

                    {/* Security note */}
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                        <FaShieldAlt className="text-xs" />
                        <p className="text-[10px] font-bold">Secured and encrypted by Stripe</p>
                    </div>

                    {/* Portal error */}
                    {portalError && (
                        <p className="text-xs text-red-500 font-bold text-center">{portalError}</p>
                    )}
                </motion.div>

                {/* ── Subtle Cancel link ── */}
                {isPaid && isActive && (
                    <div className="text-center pt-2">
                        <button
                            onClick={openPortal}
                            disabled={portalLoading}
                            className="text-[11px] text-slate-300 hover:text-red-400 transition-colors font-medium underline underline-offset-2 decoration-dashed"
                        >
                            Cancel membership
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
