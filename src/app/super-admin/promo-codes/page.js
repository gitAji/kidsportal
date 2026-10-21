"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTicketAlt, FaPlus, FaCheckCircle, FaExclamationCircle,
    FaPowerOff, FaSpinner, FaGift
} from 'react-icons/fa';

const DURATIONS = [
    { value: 'forever', label: 'Forever', hint: 'Stays free for as long as the subscription is active.' },
    { value: 'once', label: 'First billing period only', hint: 'One free month/year, then renews at full price.' },
    { value: 'repeating', label: 'For a set number of months', hint: 'Free for N billing cycles, then full price.' },
];

async function authedFetch(path, options = {}) {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) throw new Error('Not signed in.');
    const res = await fetch(path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
            ...(options.headers || {}),
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
}

function formatDate(unixSeconds) {
    if (!unixSeconds) return '—';
    return new Date(unixSeconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PromoCodesPage() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState('');

    const [code, setCode] = useState('KIDS2026');
    const [percentOff, setPercentOff] = useState(100);
    const [duration, setDuration] = useState('forever');
    const [durationInMonths, setDurationInMonths] = useState(3);
    const [maxRedemptions, setMaxRedemptions] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [togglingId, setTogglingId] = useState(null);

    const loadCodes = useCallback(async () => {
        setLoading(true);
        setListError('');
        try {
            const data = await authedFetch('/api/admin/promo-codes');
            setCodes(data.codes || []);
        } catch (err) {
            setListError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (user) loadCodes();
        });
        return () => unsub();
    }, [loadCodes]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setCreating(true);
        try {
            const body = {
                code,
                percentOff: Number(percentOff),
                duration,
                durationInMonths: duration === 'repeating' ? Number(durationInMonths) : undefined,
                maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
                expiresAt: expiresAt || undefined,
            };
            const result = await authedFetch('/api/admin/promo-codes', {
                method: 'POST',
                body: JSON.stringify(body),
            });
            setFormSuccess(`Created "${result.code}" — it works immediately at checkout.`);
            setCode('');
            setMaxRedemptions('');
            setExpiresAt('');
            loadCodes();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setCreating(false);
        }
    };

    const handleToggleActive = async (promo) => {
        setTogglingId(promo.id);
        try {
            await authedFetch(`/api/admin/promo-codes/${promo.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ active: !promo.active }),
            });
            setCodes((prev) => prev.map((c) => (c.id === promo.id ? { ...c, active: !c.active } : c)));
        } catch (err) {
            setListError(err.message);
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
                    <FaTicketAlt className="text-purple-500" />
                    Promo Codes
                </h1>
                <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">
                    Create and control Stripe discount codes for upgrading to Premium
                </p>
            </div>

            {/* ── Create Form ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-8">
                <h2 className="text-xl font-black text-white mb-1 flex items-center gap-3">
                    <FaGift className="text-emerald-400" /> New Promo Code
                </h2>
                <p className="text-slate-500 text-sm font-medium mb-6">
                    Works immediately — the checkout page already has a &quot;promo code&quot; field.
                </p>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2">Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                                placeholder="KIDS2026"
                                required
                                className="w-full bg-slate-900 border border-slate-800 text-white font-black tracking-wider px-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2">Percent Off</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={percentOff}
                                    onChange={(e) => setPercentOff(e.target.value)}
                                    required
                                    className="w-full bg-slate-900 border border-slate-800 text-white font-black px-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2">How long does the discount last?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {DURATIONS.map((d) => (
                                <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => setDuration(d.value)}
                                    className={`text-left p-4 rounded-2xl border-2 transition-all ${duration === d.value
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                                        }`}
                                >
                                    <p className={`text-sm font-black mb-1 ${duration === d.value ? 'text-purple-400' : 'text-slate-300'}`}>{d.label}</p>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{d.hint}</p>
                                </button>
                            ))}
                        </div>
                        {duration === 'repeating' && (
                            <div className="mt-3 flex items-center gap-3">
                                <span className="text-sm text-slate-400 font-bold">Free for</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={durationInMonths}
                                    onChange={(e) => setDurationInMonths(e.target.value)}
                                    className="w-20 bg-slate-900 border border-slate-800 text-white font-black px-3 py-2 rounded-xl outline-none focus:border-purple-500 text-center"
                                />
                                <span className="text-sm text-slate-400 font-bold">months</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2">
                                Max Redemptions <span className="text-slate-600 normal-case font-medium">(optional)</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={maxRedemptions}
                                onChange={(e) => setMaxRedemptions(e.target.value)}
                                placeholder="Unlimited if left blank"
                                className="w-full bg-slate-900 border border-slate-800 text-white font-bold px-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600 placeholder:font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2">
                                Expires On <span className="text-slate-600 normal-case font-medium">(optional)</span>
                            </label>
                            <input
                                type="date"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-white font-bold px-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {formError && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <FaExclamationCircle /> {formError}
                                </div>
                            </motion.div>
                        )}
                        {formSuccess && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <FaCheckCircle /> {formSuccess}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={creating}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black px-8 py-4 rounded-2xl hover:shadow-lg hover:shadow-purple-900/40 transition-all disabled:opacity-50"
                    >
                        {creating ? <><FaSpinner className="animate-spin" /> Creating...</> : <><FaPlus /> Create Promo Code</>}
                    </button>
                </form>
            </div>

            {/* ── Existing Codes ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden">
                <div className="p-8 border-b border-slate-800/50">
                    <h2 className="text-xl font-black text-white">Existing Codes</h2>
                </div>

                {listError && (
                    <div className="px-8 py-4 bg-rose-500/10 text-rose-400 text-sm font-bold">{listError}</div>
                )}

                {loading ? (
                    <div className="px-10 py-16 text-center text-slate-500 font-bold">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/30">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Code</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Discount</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Redemptions</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Expires</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {codes.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="px-10 py-6 font-black text-white tracking-wider">{c.code}</td>
                                        <td className="px-10 py-6 text-slate-300 font-bold text-sm">
                                            {c.percentOff}% off · {c.duration === 'repeating' ? `${c.durationInMonths} mo` : c.duration}
                                        </td>
                                        <td className="px-10 py-6 text-slate-400 font-bold text-sm">
                                            {c.timesRedeemed}{c.maxRedemptions ? ` / ${c.maxRedemptions}` : ''}
                                        </td>
                                        <td className="px-10 py-6 text-slate-400 font-bold text-sm">{formatDate(c.expiresAt)}</td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                onClick={() => handleToggleActive(c)}
                                                disabled={togglingId === c.id}
                                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${c.active
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20'
                                                    : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20'
                                                    }`}
                                                title={c.active ? 'Click to deactivate' : 'Click to reactivate'}
                                            >
                                                {togglingId === c.id ? <FaSpinner className="animate-spin" /> : (c.active ? <FaCheckCircle /> : <FaPowerOff />)}
                                                {c.active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {codes.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-20 text-center text-slate-500 font-bold">
                                            No promo codes yet — create one above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
