"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { motion } from 'framer-motion';
import {
    FaUsers, FaChild, FaEnvelope, FaCalendarAlt, FaSearch,
    FaCreditCard, FaCrown, FaUserAlt
} from 'react-icons/fa';

export default function ParentsManagement() {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchParents = async () => {
            try {
                // Not every parent doc has createdAt (accounts created before
                // that field existed never got it retroactively), and
                // Firestore's orderBy silently drops any doc missing the
                // sorted field — ordering here would make older accounts
                // vanish from the list entirely rather than just sort oddly.
                // Fetch everything and sort client-side instead.
                const snap = await getDocs(collection(db, 'users'));
                const parentDocs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Children live in a subcollection (users/{uid}/children), not
                // an array field on the parent doc, so the real count has to
                // be fetched per parent.
                const withChildCounts = await Promise.all(parentDocs.map(async (p) => {
                    try {
                        const childrenSnap = await getDocs(collection(db, 'users', p.id, 'children'));
                        return { ...p, childCount: childrenSnap.size };
                    } catch {
                        return { ...p, childCount: 0 };
                    }
                }));

                withChildCounts.sort((a, b) => {
                    const aTime = a.createdAt?.toMillis?.() ?? 0;
                    const bTime = b.createdAt?.toMillis?.() ?? 0;
                    return bTime - aTime;
                });

                setParents(withChildCounts);
            } catch (error) {
                console.error("Error fetching parents:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchParents();
    }, []);

    const filteredParents = parents.filter(p =>
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
                        <FaUsers className="text-emerald-500" />
                        Parent Database
                    </h1>
                    <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">Customer lifecycle and subscription management</p>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="relative">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by name, email or family ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] pl-14 pr-8 py-5 text-white font-bold placeholder:text-slate-600 outline-none focus:border-emerald-500/50 transition-all"
                />
            </div>

            {/* ── Parents Table ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <table className="w-full text-left min-w-[900px] border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 bg-slate-900/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Parent</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Plan</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Students</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500 text-right">Lifecycle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {filteredParents.map((parent) => (
                                <tr key={parent.id} className="hover:bg-slate-900/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-emerald-500 text-base border border-slate-700">
                                                <FaUserAlt />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-sm leading-tight">{parent.displayName || parent.firstName || "Parent"}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{parent.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {parent.subscriptionStatus === 'active' ? (
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-purple-500/30 shadow-lg shadow-purple-900/10">
                                                    <FaCrown className="text-[10px]" />
                                                    {parent.planId || 'Premium'}
                                                </div>
                                            ) : (
                                                <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest pl-2">Free Explorer</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                            <FaChild className="text-slate-600" />
                                            <span className="bg-slate-900 px-2 py-0.5 rounded-md text-slate-300">{parent.childCount ?? 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${parent.status === 'blocked'
                                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {parent.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex flex-col items-end">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Last Sync</p>
                                            <p className="text-xs text-slate-300 font-bold">
                                                {parent.lastLogin?.toDate?.()
                                                    ? parent.lastLogin.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                                                    : 'Recently'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
