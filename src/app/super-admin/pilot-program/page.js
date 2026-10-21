"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserAstronaut, FaSearch, FaCheckCircle, FaTimesCircle, FaSpinner,
    FaChild, FaClock, FaStar, FaFire, FaEnvelope, FaUserPlus, FaUserMinus,
    FaCalendarCheck, FaChartLine,
} from 'react-icons/fa';

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

function formatDate(ms) {
    if (!ms) return '—';
    return new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatMinutes(mins) {
    if (mins === null || mins === undefined) return '—';
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
}

const SUBJECT_LABELS = {
    english: 'English', math: 'Math', science: 'Science', tamil: 'Tamil',
    computerscience: 'Computer Science', coding: 'Coding',
};

export default function PilotProgramPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allParents, setAllParents] = useState([]);
    const [pilotDetails, setPilotDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [togglingUid, setTogglingUid] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authedFetch('/api/admin/pilot-program');
            setAllParents(data.allParents || []);
            setPilotDetails(data.pilotDetails || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleToggle = async (parentUid, nextValue) => {
        setTogglingUid(parentUid);
        try {
            await authedFetch('/api/admin/pilot-program', {
                method: 'POST',
                body: JSON.stringify({ parentUid, pilotAccess: nextValue }),
            });
            await fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setTogglingUid(null);
        }
    };

    const filteredParents = allParents.filter((p) =>
        (p.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.displayName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pilotCount = allParents.filter((p) => p.pilotAccess).length;

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
                    <FaUserAstronaut className="text-amber-400" />
                    Pilot Program
                </h1>
                <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">
                    Hand-pick free-access testers & watch their setup and progress
                </p>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold px-6 py-4 rounded-2xl">
                    {error}
                </div>
            )}

            {/* ── Grant Access ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <FaUserPlus className="text-emerald-500" /> Grant Free Access
                    </h2>
                    <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                        {pilotCount} active tester{pilotCount === 1 ? '' : 's'}
                    </span>
                </div>

                <div className="relative">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-[1.5rem] pl-14 pr-8 py-4 text-white font-bold placeholder:text-slate-600 outline-none focus:border-emerald-500/50 transition-all"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-500 font-bold">Loading parents...</div>
                ) : (
                    <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2">
                        {filteredParents.slice(0, 50).map((p) => (
                            <div key={p.uid} className="flex items-center justify-between gap-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl px-5 py-3">
                                <div className="min-w-0">
                                    <p className="text-white font-black text-sm truncate">{p.displayName || 'Parent'}</p>
                                    <p className="text-slate-500 text-xs font-bold truncate">{p.email || p.uid}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                                        <FaChild className="text-slate-600" /> {p.childCount}
                                    </span>
                                    <button
                                        onClick={() => handleToggle(p.uid, !p.pilotAccess)}
                                        disabled={togglingUid === p.uid}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all disabled:opacity-50 ${p.pilotAccess
                                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                            }`}
                                    >
                                        {togglingUid === p.uid ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : p.pilotAccess ? (
                                            <><FaUserMinus /> Revoke</>
                                        ) : (
                                            <><FaUserPlus /> Grant</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredParents.length === 0 && (
                            <p className="text-center py-6 text-slate-600 font-bold">No parents match that search.</p>
                        )}
                    </div>
                )}
            </div>

            {/* ── Pilot Cohort Monitoring ── */}
            <div>
                <h2 className="text-xl font-black text-white flex items-center gap-3 mb-5">
                    <FaChartLine className="text-blue-500" /> Pilot Cohort
                </h2>

                {!loading && pilotDetails.length === 0 && (
                    <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-12 text-center text-slate-500 font-bold">
                        No pilot testers yet — grant access to a few families above to get started.
                    </div>
                )}

                <div className="space-y-6">
                    <AnimatePresence>
                        {pilotDetails.map((family) => (
                            <motion.div
                                key={family.uid}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden"
                            >
                                {/* Parent header */}
                                <div className="bg-slate-900/50 border-b border-slate-800/50 p-6 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-white font-black text-lg">{family.displayName || 'Parent'}</p>
                                        <p className="text-slate-500 text-xs font-bold">{family.email}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300">
                                            <FaCalendarCheck className="text-slate-500" /> Signed up {formatDate(family.createdAt)}
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black border ${family.emailVerified
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            <FaEnvelope /> {family.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                                        </div>
                                        <div className="flex items-center gap-2 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1.5 rounded-full text-xs font-black">
                                            Pilot since {formatDate(family.pilotAccessGrantedAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Children */}
                                {family.children.length === 0 ? (
                                    <div className="p-6 text-center text-slate-600 font-bold text-sm">
                                        No child profiles set up yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-800/30">
                                        {family.children.map((child) => (
                                            <div key={child.id} className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
                                                <div className="col-span-2 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-blue-400 text-sm border border-slate-700">
                                                        <FaChild />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black text-sm leading-tight">{child.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold">{child.grade || 'No grade set'}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Setup Time</p>
                                                    <p className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                                                        <FaClock className="text-slate-600" />
                                                        {child.setupMinutes !== null ? formatMinutes(child.setupMinutes) : (child.firstLoginAt ? '—' : 'Not logged in yet')}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Time Active</p>
                                                    <p className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                                                        <FaFire className="text-orange-500" /> {formatMinutes(child.totalMinutesActive)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Progress</p>
                                                    <p className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                                                        <FaStar className="text-yellow-400" /> {child.totalTasksCompleted} tasks · {child.uniqueDaysActive}d active
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Interested In</p>
                                                    {child.topInterestSubject ? (
                                                        <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-black">
                                                            {SUBJECT_LABELS[child.topInterestSubject] || child.topInterestSubject}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600 text-xs font-bold">No activity yet</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
