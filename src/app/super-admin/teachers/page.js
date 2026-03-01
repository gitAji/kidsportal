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
    FaEnvelope, FaCalendarAlt, FaShieldAlt, FaTimes
} from 'react-icons/fa';

export default function TeachersManagement() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
            // Using email as ID for consistency with login check
            const teacherRef = doc(db, 'teachers', newEmail.toLowerCase().trim());
            await setDoc(teacherRef, {
                name: newName,
                email: newEmail.toLowerCase().trim(),
                role: 'teacher',
                createdAt: serverTimestamp(),
                status: 'active'
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

    const handleDeleteTeacher = async (id) => {
        if (!confirm("Are you sure? This teacher will lose all access to the Curriculum Builder immediately.")) return;
        try {
            await deleteDoc(doc(db, 'teachers', id));
            fetchTeachers();
        } catch (error) {
            alert("Error deleting teacher: " + error.message);
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
                        <FaChalkboardTeacher className="text-blue-500" />
                        Teacher Registry
                    </h1>
                    <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">Manage platform curriculum instructors</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <FaPlus /> Authorise Teacher
                </button>
            </div>

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
                                <h2 className="text-3xl font-black text-white tracking-tight mb-2">New Instructor</h2>
                                <p className="text-slate-500 font-medium">Add an email to the whitelist to grant curriculum access.</p>
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
                                        The teacher MUST use this specific email address for Google login to gain access to the curriculum dashboard.
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

            {/* ── Search & Filter ── */}
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
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-blue-500 text-lg border border-slate-700">
                                                {teacher.name?.charAt(0) || teacher.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-black">{teacher.name || "Unnamed Teacher"}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Level 1 Specialist</p>
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
                                            {teacher.createdAt?.toDate().toLocaleDateString() || 'Historical'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${teacher.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                                            }`}>
                                            {teacher.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {teacher.status === 'pending' && (
                                                <button
                                                    onClick={() => handleAuthorizeTeacher(teacher.id)}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                                                >
                                                    Authorize
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
                                            <p className="text-slate-500 font-bold text-lg">No teachers found in the registry.</p>
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
