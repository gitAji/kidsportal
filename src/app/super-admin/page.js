"use client";
import React, { useState, useEffect } from 'react';
import {
    collection, getDocs, query, where, limit, doc, updateDoc,
    serverTimestamp, orderBy, collectionGroup
} from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChalkboardTeacher, FaUsers, FaChild, FaCreditCard,
    FaArrowUp, FaCalendarPlus, FaUserShield,
    FaCheck, FaTimes, FaBell, FaChartLine, FaDatabase,
    FaGlobe, FaClock, FaUserPlus, FaTicketAlt
} from 'react-icons/fa';
import Link from 'next/link';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        totalTeachers: 0,
        activeTeachers: 0,
        pendingTeachers: 0,
        suspendedTeachers: 0,
        totalParents: 0,
        totalStudents: 0,
    });
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [recentParents, setRecentParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            await Promise.all([
                fetchStats(),
                fetchPendingTeachers(),
                fetchRecentParents(),
                fetchTickets(),
            ]);
        } catch (error) {
            console.error("Dashboard data error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Fetch teachers with status breakdown
            const teachersSnap = await getDocs(collection(db, 'teachers'));
            const teachersList = teachersSnap.docs.map(d => d.data());

            // Fetch parents
            const parentsSnap = await getDocs(collection(db, 'users'));

            // Fetch all children using collection group query
            let totalStudents = 0;
            try {
                const childrenSnap = await getDocs(collectionGroup(db, 'children'));
                totalStudents = childrenSnap.size;
            } catch {
                // Fallback: count from parent docs
                totalStudents = parentsSnap.docs.reduce((acc, doc) => {
                    const data = doc.data();
                    return acc + (data.children?.length || 0);
                }, 0);
            }

            setStats({
                totalTeachers: teachersList.length,
                activeTeachers: teachersList.filter(t => t.status === 'active').length,
                pendingTeachers: teachersList.filter(t => t.status === 'pending').length,
                suspendedTeachers: teachersList.filter(t => t.status === 'suspended' || t.status === 'denied').length,
                totalParents: parentsSnap.size,
                totalStudents: totalStudents,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchPendingTeachers = async () => {
        try {
            const q = query(
                collection(db, 'teachers'),
                where('status', '==', 'pending'),
                limit(5)
            );
            const snap = await getDocs(q);
            setPendingTeachers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching pending:", error);
        }
    };

    const fetchRecentParents = async () => {
        try {
            const q = query(
                collection(db, 'users'),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const snap = await getDocs(q);
            setRecentParents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching recent parents:", error);
        }
    };

    const fetchTickets = async () => {
        try {
            const q = query(
                collection(db, 'tickets'),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const snap = await getDocs(q);
            setTickets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching tickets:", error);
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
        if (!confirm("Deny this teacher application?")) return;
        setActionLoading(id);
        try {
            await updateDoc(doc(db, 'teachers', id), {
                status: 'suspended',
                suspendedAt: serverTimestamp()
            });
            setPendingTeachers(prev => prev.filter(t => t.id !== id));
            fetchStats();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const statCards = [
        {
            name: 'Total Teachers',
            value: stats.totalTeachers,
            detail: `${stats.activeTeachers} active, ${stats.pendingTeachers} pending`,
            icon: <FaChalkboardTeacher />,
            gradient: 'from-blue-600 to-blue-700',
            path: '/super-admin/teachers'
        },
        {
            name: 'Total Parents',
            value: stats.totalParents,
            detail: 'Registered accounts',
            icon: <FaUsers />,
            gradient: 'from-emerald-600 to-emerald-700',
            path: '/super-admin/parents'
        },
        {
            name: 'Total Students',
            value: stats.totalStudents,
            detail: 'Active child profiles',
            icon: <FaChild />,
            gradient: 'from-violet-600 to-violet-700',
            path: '/super-admin/parents'
        },
        {
            name: 'Open Tickets',
            value: tickets.filter(t => t.status === 'open').length,
            detail: 'Support requests',
            icon: <FaTicketAlt />,
            gradient: 'from-rose-600 to-rose-700',
            path: '#'
        },
    ];

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="space-y-10">
            {/* ── Welcome Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-blue-500 font-black text-sm uppercase tracking-[3px] mb-2">{greeting}</p>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Systems Overview</h1>
                    <p className="text-slate-400 font-medium">Real-time platform metrics and administrative control center.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4 border border-slate-700/50">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Status</p>
                            <p className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">Fully Operational</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <Link href={card.path} key={i}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-slate-700 transition-all duration-500 cursor-pointer"
                        >
                            <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${card.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700`} />

                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    {card.icon}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{card.name}</p>
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-2">
                                    {loading ? <span className="animate-pulse">...</span> : card.value}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{card.detail}</p>
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
                                Pending Teacher Approvals
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">Teachers waiting for your authorization</p>
                        </div>
                        <Link href="/super-admin/teachers" className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all">View All</Link>
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
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-black text-amber-400 text-lg">
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
                                            className="px-4 py-2 rounded-xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white flex items-center gap-2 transition-all border border-emerald-500/20 text-xs font-black uppercase tracking-wider"
                                            title="Approve"
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleDeny(teacher.id)}
                                            disabled={actionLoading === teacher.id}
                                            className="px-4 py-2 rounded-xl bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white flex items-center gap-2 transition-all border border-rose-500/20 text-xs font-black uppercase tracking-wider"
                                            title="Deny"
                                        >
                                            <FaTimes /> Deny
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {pendingTeachers.length === 0 && !loading && (
                            <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                    <FaCheck className="text-2xl text-emerald-500" />
                                </div>
                                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">All caught up! No pending applications.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Quick Actions + System Info */}
                <div className="flex flex-col gap-6">
                    {/* Admin Quick Control */}
                    <div className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-[3rem] p-10 shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <FaUserShield size={120} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight mb-4 leading-tight relative z-10">Admin Control</h2>
                        <p className="text-blue-100/70 text-sm font-medium mb-6 relative z-10">Manage educators and platform access.</p>
                        <div className="space-y-3 relative z-10">
                            <Link
                                href="/super-admin/teachers"
                                className="block w-full text-center bg-white text-blue-700 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Open Teacher Registry
                            </Link>
                            <Link
                                href="/super-admin/learning-config"
                                className="block w-full text-center bg-white/10 backdrop-blur text-white border border-white/20 py-4 rounded-2xl font-black text-sm hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                ⚙️ Learning Configuration
                            </Link>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10">
                        <h2 className="text-xl font-black text-white tracking-tight mb-6 flex items-center gap-3">
                            <FaDatabase className="text-blue-500" />
                            System Health
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
                                    <span>Firestore</span>
                                    <span className="text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Online
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
                                    <span>Authentication</span>
                                    <span className="text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
                                    <span>Admin Session</span>
                                    <span className="text-blue-400">{auth.currentUser?.email?.split('@')[0] || 'Unknown'}</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[100%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Registrations ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <FaUserPlus className="text-emerald-500 text-xl" />
                            Recent Parent Registrations
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Newest parent accounts on the platform</p>
                    </div>
                    <Link href="/super-admin/parents" className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all">View All</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-500">Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-500">Email</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-500">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {recentParents.map((parent) => (
                                <tr key={parent.id} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-emerald-400">
                                                {parent.displayName?.charAt(0) || parent.name?.charAt(0) || parent.email?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <span className="text-white font-bold">{parent.displayName || parent.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 font-medium text-sm">{parent.email}</td>
                                    <td className="px-6 py-5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        {parent.createdAt?.toDate?.() ? parent.createdAt.toDate().toLocaleDateString() : 'Recently'}
                                    </td>
                                </tr>
                            ))}
                            {recentParents.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-slate-600 font-bold text-sm">
                                        No parent registrations yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Support Tickets ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <FaTicketAlt className="text-rose-500 text-xl" />
                            Support Tickets & Messages
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Recent inquiries from the contact form</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-500">From</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-500">Subject</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-500">Message</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div>
                                            <p className="text-white font-bold">{ticket.name}</p>
                                            <p className="text-[10px] text-slate-500">{ticket.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-blue-400 font-bold text-sm">{ticket.subject}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-slate-400 text-sm line-clamp-2 max-w-md">{ticket.message}</p>
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        {ticket.createdAt?.toDate?.() ? ticket.createdAt.toDate().toLocaleDateString() : 'Recently'}
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-600 font-bold text-sm">
                                        No tickets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Platform Summary Footer ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <FaGlobe className="text-xl" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform</p>
                        <p className="text-white font-bold">KidsPortal v2.0</p>
                    </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <FaChartLine className="text-xl" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uptime</p>
                        <p className="text-emerald-400 font-bold">99.9% Available</p>
                    </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                        <FaCalendarPlus className="text-xl" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Updated</p>
                        <p className="text-white font-bold">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
