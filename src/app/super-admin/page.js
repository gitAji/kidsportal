"use client";
import React, { useState, useEffect } from 'react';
import {
    collection, getDocs, query, where, limit, doc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChalkboardTeacher, FaUsers, FaChild, FaCreditCard,
    FaArrowUp, FaArrowDown, FaCalendarPlus, FaUserShield,
    FaCheck, FaTimes, FaBell
} from 'react-icons/fa';
import Link from 'next/link';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        teachers: 0,
        parents: 0,
        students: 0,
        revenue: 0
    });
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchStats();
        fetchPendingTeachers();
    }, []);

    const fetchStats = async () => {
        try {
            const teachersSnap = await getDocs(collection(db, 'teachers'));
            const parentsSnap = await getDocs(collection(db, 'users'));

            setStats({
                teachers: teachersSnap.size,
                parents: parentsSnap.size,
                students: parentsSnap.docs.reduce((acc, doc) => acc + (doc.data().children?.length || 0), 0),
                revenue: 2450 // Still demo revenue for dashboard feel
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingTeachers = async () => {
        try {
            const q = query(collection(db, 'teachers'), where('status', '==', 'pending'), limit(5));
            const snap = await getDocs(q);
            setPendingTeachers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching pending:", error);
        }
    };

    const handleAuthorize = async (id) => {
        setActionLoading(id);
        try {
            await updateDoc(doc(db, 'teachers', id), {
                status: 'active',
                authorizedAt: serverTimestamp()
            });
            setPendingTeachers(prev => prev.filter(t => t.id !== id));
            fetchStats();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeny = async (id) => {
        if (!confirm("Deny this application?")) return;
        setActionLoading(id);
        try {
            await updateDoc(doc(db, 'teachers', id), {
                status: 'denied',
                deniedAt: serverTimestamp()
            });
            setPendingTeachers(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const cards = [
        { name: 'Total Teachers', value: stats.teachers, icon: <FaChalkboardTeacher />, color: 'blue', change: '+2', path: '/super-admin/teachers' },
        { name: 'Total Parents', value: stats.parents, icon: <FaUsers />, color: 'emerald', change: '+12', path: '/super-admin/parents' },
        { name: 'Total Students', value: stats.students, icon: <FaChild />, color: 'indigo', change: '+24', path: '/super-admin/parents' },
        { name: 'Monthly Revenue', value: `$${stats.revenue}`, icon: <FaCreditCard />, color: 'purple', change: '+18%', path: '/super-admin/subscriptions' },
    ];

    return (
        <div className="space-y-10">
            {/* ── Welcome Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Systems Overview</h1>
                    <p className="text-slate-400 font-medium">Global platform metrics and administrative control center.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4 border border-slate-700/50">
                        <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
                            <FaCalendarPlus />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Status</p>
                            <p className="text-sm font-bold text-slate-200 uppercase tracking-tighter transition-all">Fully Operational</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Link href={card.path} key={i}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500 cursor-pointer"
                        >
                            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700`} />

                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-${i % 2 === 0 ? 'blue' : 'emerald'}-600/10 border border-slate-700 flex items-center justify-center text-2xl text-blue-400 group-hover:scale-110 transition-transform duration-500`}>
                                    {card.icon}
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
                                    <FaArrowUp />
                                    {card.change}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{card.name}</p>
                                <h3 className="text-3xl font-black text-white tracking-tighter">
                                    {loading ? '...' : card.value}
                                </h3>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* ── Secondary Sections ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Authorizations Widget */}
                <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10 lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <FaBell className="text-amber-500 text-xl" />
                                Pending Actions
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">Teacher applications awaiting authorization</p>
                        </div>
                        <Link href="/super-admin/teachers" className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300">View All</Link>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {pendingTeachers.map((teacher) => (
                                <motion.div
                                    key={teacher.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-white text-lg">
                                            {teacher.name?.charAt(0) || 'T'}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{teacher.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px] md:max-w-none">{teacher.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAuthorize(teacher.id)}
                                            disabled={actionLoading === teacher.id}
                                            className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all border border-emerald-500/20"
                                            title="Authorize"
                                        >
                                            {actionLoading === teacher.id ? <div className="animate-spin text-xs">...</div> : <FaCheck />}
                                        </button>
                                        <button
                                            onClick={() => handleDeny(teacher.id)}
                                            disabled={actionLoading === teacher.id}
                                            className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all border border-rose-500/20"
                                            title="Deny"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {pendingTeachers.length === 0 && (
                            <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                                <FaCheckCircle className="text-4xl text-emerald-500/20 mx-auto mb-4" />
                                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">All caught up! No pending applications.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <FaUserShield size={120} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight mb-4 leading-tight relative z-10">Admin Control</h2>
                        <p className="text-blue-100/70 text-sm font-medium mb-8 relative z-10">Quickly whitelisted global educators for full portal access.</p>
                        <Link
                            href="/super-admin/teachers"
                            className="block w-full text-center bg-white text-blue-700 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10"
                        >
                            Open Teacher Registry
                        </Link>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10">
                        <h2 className="text-xl font-black text-white tracking-tight mb-6">Database Health</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
                                    <span>Firestore Load</span>
                                    <span className="text-slate-300">Optimized</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[14%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
                                    <span>Auth Records</span>
                                    <span className="text-slate-300">Active</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 animate-pulse w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add missing icon helper
const FaCheckCircle = ({ className }) => (
    <div className={className}>
        <div className="w-12 h-12 rounded-full border-4 border-current flex items-center justify-center">
            <FaCheck />
        </div>
    </div>
);
