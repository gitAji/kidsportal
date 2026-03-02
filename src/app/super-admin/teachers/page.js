"use client";
import React, { useState, useEffect } from 'react';
import {
    collection, getDocs, doc, setDoc, deleteDoc, updateDoc,
    query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChalkboardTeacher, FaPlus, FaTrashAlt, FaSearch,
    FaEnvelope, FaCalendarAlt, FaShieldAlt, FaTimes,
    FaCheckCircle, FaClock, FaBan, FaUsers
} from 'react-icons/fa';

export default function TeachersManagement() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, active, suspended
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'teachers'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setTeachers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        if (!newEmail || !newName) return;

        setActionLoading(true);
        try {
            const teacherRef = doc(db, 'teachers', newEmail.toLowerCase().trim());
            await setDoc(teacherRef, {
                name: newName,
                email: newEmail.toLowerCase().trim(),
                role: 'teacher',
                createdAt: serverTimestamp(),
                status: 'active',
                authorizedAt: serverTimestamp()
            });
            setNewEmail('');
            setNewName('');
            setIsAddOpen(false);
            fetchTeachers();
        } catch (error) {
            alert("Error adding teacher: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAuthorizeTeacher = async (id) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, 'teachers', id), {
                status: 'active',
                authorizedAt: serverTimestamp()
            });
            fetchTeachers();
        } catch (error) {
            alert("Error authorizing teacher: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSuspendTeacher = async (id) => {
        if (!confirm("Are you sure you want to deny/suspend this teacher? They will not be able to access the portal.")) return;
        setActionLoading(true);
        try {
            await updateDoc(doc(db, 'teachers', id), {
                status: 'suspended',
                suspendedAt: serverTimestamp()
            });
            fetchTeachers();
        } catch (error) {
            alert("Error suspending teacher: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteTeacher = async (id) => {
        if (!confirm("Are you sure? This teacher will be permanently removed from the registry.")) return;
        try {
            await deleteDoc(doc(db, 'teachers', id));
            fetchTeachers();
        } catch (error) {
            alert("Error deleting teacher: " + error.message);
        }
    };

    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const pendingCount = teachers.filter(t => t.status === 'pending').length;
    const activeCount = teachers.filter(t => t.status === 'active').length;
    const suspendedCount = teachers.filter(t => t.status === 'suspended').length;

    const statusTabs = [
        { id: 'all', label: 'All', count: teachers.length, icon: <FaUsers /> },
        { id: 'pending', label: 'Pending', count: pendingCount, icon: <FaClock />, color: 'amber' },
        { id: 'active', label: 'Active', count: activeCount, icon: <FaCheckCircle />, color: 'emerald' },
        { id: 'suspended', label: 'Denied', count: suspendedCount, icon: <FaBan />, color: 'rose' },
    ];

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
                        <FaChalkboardTeacher className="text-blue-500" />
                        Teacher Registry
                    </h1>
                    <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">Manage & authorize platform educators</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <FaPlus /> Add Teacher Manually
                </button>
            </div>

            {/* ── Status Filter Tabs ── */}
            <div className="flex flex-wrap gap-3">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all border ${statusFilter === tab.id
                            ? tab.color
                                ? `bg-${tab.color}-500/10 border-${tab.color}-500/30 text-${tab.color}-400`
                                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${statusFilter === tab.id
                            ? tab.color
                                ? `bg-${tab.color}-500/20`
                                : 'bg-blue-500/20'
                            : 'bg-slate-800'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Pending Alert Banner ── */}
            {pendingCount > 0 && statusFilter !== 'pending' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                            <FaClock className="text-lg" />
                        </div>
                        <div>
                            <p className="text-amber-400 font-black text-sm">{pendingCount} teacher{pendingCount > 1 ? 's' : ''} waiting for approval</p>
                            <p className="text-slate-500 text-xs font-medium mt-0.5">New registrations require your authorization</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                        Review Now
                    </button>
                </motion.div>
            )}

            {/* ── Add Teacher Modal ── */}
            <AnimatePresence>
                {isAddOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                    >
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 shadow-3xl shadow-black/50"
                        >
                            <button onClick={() => setIsAddOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                                <FaTimes className="text-xl" />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-white tracking-tight mb-2">Add Teacher Manually</h2>
                                <p className="text-slate-500 font-medium">Pre-authorize a teacher so they can log in immediately.</p>
                            </div>

                            <form onSubmit={handleAddTeacher} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g. John Smith"
                                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 ml-1">Google Email Address</label>
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="teacher@gmail.com"
                                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700"
                                        required
                                    />
                                </div>

                                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl flex gap-3 items-start">
                                    <FaShieldAlt className="text-blue-500 mt-1 flex-shrink-0" />
                                    <p className="text-[11px] text-blue-400 leading-relaxed font-bold italic">
                                        This teacher will be pre-authorized with &quot;Active&quot; status and can log in immediately using Google.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-16 rounded-2xl font-black shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {actionLoading ? "Processing..." : "Grant Active Access"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Search ── */}
            <div className="relative">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] pl-14 pr-8 py-5 text-white font-bold placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all"
                />
            </div>

            {/* ── Teachers Table ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 bg-slate-900/30">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Instructor</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Contact</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Registered</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-slate-900/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border ${teacher.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : teacher.status === 'pending'
                                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                }`}>
                                                {teacher.name?.charAt(0) || teacher.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-black">{teacher.name || "Unnamed Teacher"}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">
                                                    {teacher.status === 'pending' ? 'Awaiting Approval' : teacher.status === 'suspended' ? 'Access Denied' : 'Authorized Educator'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                            <FaEnvelope className="text-slate-600" />
                                            {teacher.email}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                            <FaCalendarAlt className="text-slate-700" />
                                            {teacher.createdAt?.toDate?.() ? teacher.createdAt.toDate().toLocaleDateString() : 'Recently'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${teacher.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : teacher.status === 'pending'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                                                : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                            {teacher.status === 'active' ? 'Active' : teacher.status === 'pending' ? 'Pending' : 'Denied'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {teacher.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAuthorizeTeacher(teacher.id)}
                                                        disabled={actionLoading}
                                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleSuspendTeacher(teacher.id)}
                                                        disabled={actionLoading}
                                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50"
                                                    >
                                                        Deny
                                                    </button>
                                                </>
                                            )}
                                            {teacher.status === 'active' && (
                                                <button
                                                    onClick={() => handleSuspendTeacher(teacher.id)}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            {teacher.status === 'suspended' && (
                                                <button
                                                    onClick={() => handleAuthorizeTeacher(teacher.id)}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    Reactivate
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteTeacher(teacher.id)}
                                                className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTeachers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <FaChalkboardTeacher className="text-6xl text-slate-800" />
                                            <p className="text-slate-500 font-bold text-lg">
                                                {statusFilter !== 'all'
                                                    ? `No ${statusFilter} teachers found.`
                                                    : 'No teachers found in the registry.'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
