"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import {
    FaCreditCard, FaCrown, FaCalendarAlt,
    FaSyncAlt, FaCheckCircle, FaSpinner,
    FaExclamationTriangle, FaShieldAlt, FaLock, FaFileInvoiceDollar, FaExternalLinkAlt
} from "react-icons/fa";
import { collection, query, orderBy, limit } from "firebase/firestore";
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

// ── Main Page ──────────────────────────────────────────────────────
export default function BillingPage() {
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [portalLoading, setPortalLoading] = useState(false);
    const [portalError, setPortalError] = useState("");
    const [payments, setPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const syncWithStripe = async () => {
        setSyncing(true);
        try {
            const res = await fetch("/api/stripe/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: auth.currentUser?.uid }),
            });
            const data = await res.json();
            if (!data.success) alert(data.error || "Sync failed.");
        } catch (err) {
            console.error("Sync error:", err);
            alert("Network error during sync.");
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) { setLoading(false); return; }

            const ref = doc(db, "users", user.uid);
            const unsubSnap = onSnapshot(ref, (snap) => {
                const data = snap.data() || {};

                if (data.planType === 'paid') {
                    setSub({
                        ...(data.subscription || {}),
                        status: data.subscriptionStatus || data.subscription?.status || 'inactive',
                        plan: data.subscriptionPlan || data.subscription?.plan,
                        currentPeriodEnd: data.subscriptionExpiresAt || data.subscription?.currentPeriodEnd,
                        card: data.subscription?.card || null
                    });
                } else if (data.planType === 'free_trial' || (!data.subscription && data.createdAt)) {
                    const trialEnd = data.trialEndDate?.toDate ? data.trialEndDate.toDate() : (data.trialEndDate ? new Date(data.trialEndDate) : null);
                    let finalTrialEnd = trialEnd;
                    if (!finalTrialEnd) {
                        const base = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date());
                        finalTrialEnd = new Date(base);
                        finalTrialEnd.setMonth(finalTrialEnd.getMonth() + 1);
                    }
                    setSub({
                        plan: "trial",
                        status: finalTrialEnd > new Date() ? "active" : "expired",
                        currentPeriodEnd: finalTrialEnd,
                        ...(data.subscription || {}),
                        card: data.subscription?.card || null,
                    });
                } else if (data.subscription) {
                    setSub(data.subscription);
                }
                setLoading(false);
            });

            // Fetch payments
            const paymentsRef = collection(db, "users", user.uid, "payments");
            const q = query(paymentsRef, orderBy("paymentDate", "desc"), limit(5));
            const unsubPayments = onSnapshot(q, (snap) => {
                const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPayments(list);
                setPaymentsLoading(false);
            }, (err) => {
                console.error("Error fetching payments:", err);
                setPaymentsLoading(false);
            });

            return () => {
                unsubSnap();
                unsubPayments();
            };
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
    const isActive = sub?.status === "active" || sub?.status === "trialing";
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
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Billing & Subscription</h1>
                        <p className="text-sm text-slate-400 font-medium mt-0.5">Manage your family&apos;s membership and billing history</p>
                    </div>
                    <button
                        onClick={syncWithStripe}
                        disabled={syncing || loading}
                        title="Sync with Stripe"
                        className={`p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all ${syncing ? 'animate-spin' : ''}`}
                    >
                        <FaSyncAlt className="text-sm" />
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">
                {/* ── Plan Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className={`h-1.5 w-full ${palette.bg}`} />
                    <div className="p-6">
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

                        <div className="divide-y divide-slate-50">
                            <BillingRow icon={<FaSyncAlt />} label="Billing cycle" value={planInfo.cycle} />
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

                        {isTrial && isActive && days !== null && days <= 10 && (
                            <div className="mt-4 flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold text-amber-600">
                                <FaExclamationTriangle className="flex-shrink-0" />
                                Your free trial expires in {days} day{days !== 1 ? "s" : ""}.
                            </div>
                        )}

                        {isExpired && (
                            <div className="mt-4 flex items-center gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-500">
                                <FaExclamationTriangle className="flex-shrink-0" />
                                Your plan has expired. Upgrade to restore access.
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
                                <div className="w-16 h-10 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-end pb-1.5 px-2 shadow-md flex-shrink-0">
                                    <div className="flex gap-0.5">
                                        {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-white/40" />)}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-black text-slate-800 capitalize">{cardBrand || "Card"} ending in {cardLast4}</p>
                                    {cardExpiry && <p className="text-xs text-slate-400 font-medium mt-0.5">Expires {cardExpiry}</p>}
                                </div>
                                {isPaid && (
                                    <button onClick={openPortal} disabled={portalLoading} className="text-xs font-bold text-blue-500 hover:text-blue-700">Update</button>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <FaLock className="text-slate-300 text-lg" />
                                </div>
                                <p className="text-sm font-black text-slate-500">No card on file</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── Invoice History ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50">
                        <FaFileInvoiceDollar className="text-green-400 text-base" />
                        <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider">Invoice History</h2>
                    </div>
                    <div className="p-6">
                        {paymentsLoading ? (
                            <div className="flex justify-center py-4"><FaSpinner className="animate-spin text-slate-200" /></div>
                        ) : payments.length > 0 ? (
                            <div className="space-y-4">
                                {payments.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 px-2 -mx-2 rounded-xl hover:bg-slate-50 transition-all">
                                        <div>
                                            <p className="text-base font-black text-slate-800">{(p.currency || '$').toUpperCase()} {p.amountPaid?.toFixed(2)}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">{p.paymentDate?.toDate ? formatDate(p.paymentDate) : "Recent Payment"}</p>
                                        </div>
                                        {p.hostedInvoiceUrl && (
                                            <a href={p.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-black transition-all">
                                                View PDF <FaExternalLinkAlt className="text-[10px]" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 font-medium text-center py-4 italic">No invoices found</p>
                        )}
                    </div>
                </motion.div>

                {/* ── Action Buttons ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="space-y-3">
                    {isPaid && isActive ? (
                        <button onClick={openPortal} disabled={portalLoading} className="w-full py-4 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-100 flex items-center justify-center gap-2">
                            {portalLoading ? <FaSpinner className="animate-spin" /> : <FaCreditCard />} Manage Subscription
                        </button>
                    ) : (
                        <a href="/pricing" className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-black rounded-2xl hover:scale-[1.01] shadow-lg shadow-blue-200 block text-center transition-all">
                            {isExpired ? "Renew Subscription" : "Upgrade Plan"}
                        </a>
                    )}
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                        <FaShieldAlt className="text-[10px]" />
                        <p className="text-[10px] font-bold">Payments secured by Stripe</p>
                    </div>
                    {portalError && <p className="text-xs text-red-500 font-bold text-center">{portalError}</p>}
                </motion.div>

                {isPaid && isActive && (
                    <div className="text-center pt-2">
                        <button onClick={openPortal} className="text-[11px] text-slate-300 hover:text-red-400 transition-colors underline underline-offset-4 decoration-dashed font-bold">
                            Cancel membership
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
