"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { auth } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChild, FaSearch, FaUserAlt, FaLock, FaLockOpen, FaKey,
    FaChartBar, FaTimes, FaCopy, FaCheckCircle, FaSpinner, FaClock,
    FaStar, FaFire, FaBookOpen,
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

export default function StudentsManagement() {
    const searchParams = useSearchParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Pre-filled when arriving from a parent's row on the Parents page
    // (?q=parent@email.com), so "view their students" is one click away.
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [busyId, setBusyId] = useState(null);

    const [reportTarget, setReportTarget] = useState(null); // { parentUid, childId }
    const [reportData, setReportData] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

    const [resetResult, setResetResult] = useState(null); // { name, username, newPassword }
    const [copied, setCopied] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authedFetch('/api/admin/students');
            setStudents(data.students || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const openReport = async (student) => {
        setReportTarget(student);
        setReportData(null);
        setReportLoading(true);
        try {
            const data = await authedFetch(`/api/admin/students?parentUid=${student.parentUid}&childId=${student.id}`);
            setReportData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setReportLoading(false);
        }
    };

    const handleToggleLogin = async (student) => {
        setBusyId(student.id);
        try {
            await authedFetch('/api/admin/students', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'setLoginEnabled',
                    parentUid: student.parentUid,
                    childId: student.id,
                    loginEnabled: !student.loginEnabled,
                }),
            });
            await fetchStudents();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusyId(null);
        }
    };

    const handleResetPassword = async (student) => {
        if (!window.confirm(`Reset ${student.name}'s password? Their old password will stop working immediately.`)) return;
        setBusyId(student.id);
        try {
            const data = await authedFetch('/api/admin/students', {
                method: 'POST',
                body: JSON.stringify({ action: 'resetPassword', parentUid: student.parentUid, childId: student.id }),
            });
            setResetResult({ name: student.name, username: data.username, newPassword: data.newPassword });
        } catch (err) {
            setError(err.message);
        } finally {
            setBusyId(null);
        }
    };

    const copyPassword = () => {
        if (!resetResult) return;
        navigator.clipboard?.writeText(resetResult.newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredStudents = students.filter((s) =>
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.parentEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.parentName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
                        <FaChild className="text-blue-500" />
                        Students
                    </h1>
                    <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">
                        Every learner across every family — {students.length} total
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-between gap-4">
                    {error}
                    <button onClick={() => setError(null)} className="text-rose-400/70 hover:text-rose-300"><FaTimes /></button>
                </div>
            )}

            {/* ── Search ── */}
            <div className="relative">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by student name, username, or parent email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] pl-14 pr-8 py-5 text-white font-bold placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all"
                />
            </div>

            {/* ── Students Table ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <table className="w-full text-left min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 bg-slate-900/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Student</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Grade</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Parent</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[3px] text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {loading ? (
                                <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-500 font-bold">
                                    <FaSpinner className="animate-spin inline-block mr-2" /> Loading students...
                                </td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-500 font-bold">No students found.</td></tr>
                            ) : filteredStudents.map((student) => (
                                <tr key={`${student.parentUid}-${student.id}`} className="hover:bg-slate-900/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center font-black text-blue-500 text-base border border-slate-700">
                                                <FaUserAlt />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-sm leading-tight">{student.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">@{student.username || 'no-username'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-slate-300 font-bold text-xs bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                                            {student.grade || '—'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-slate-300 font-bold text-xs leading-tight">{student.parentName || 'Parent'}</p>
                                        <p className="text-[10px] text-slate-500 font-bold">{student.parentEmail}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${student.loginEnabled
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                            {student.loginEnabled ? 'Active' : 'Blocked'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openReport(student)}
                                                title="View report"
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                                            >
                                                <FaChartBar className="text-xs" />
                                            </button>
                                            <button
                                                onClick={() => handleResetPassword(student)}
                                                disabled={busyId === student.id}
                                                title="Reset password"
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all disabled:opacity-40"
                                            >
                                                {busyId === student.id ? <FaSpinner className="animate-spin text-xs" /> : <FaKey className="text-xs" />}
                                            </button>
                                            <button
                                                onClick={() => handleToggleLogin(student)}
                                                disabled={busyId === student.id}
                                                title={student.loginEnabled ? 'Block student' : 'Unblock student'}
                                                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all disabled:opacity-40 ${student.loginEnabled
                                                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                                    }`}
                                            >
                                                {busyId === student.id ? <FaSpinner className="animate-spin text-xs" /> : student.loginEnabled ? <FaLock className="text-xs" /> : <FaLockOpen className="text-xs" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Report Modal ── */}
            <AnimatePresence>
                {reportTarget && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                    >
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setReportTarget(null)} />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 shadow-3xl shadow-black/50 max-h-[85vh] overflow-y-auto"
                        >
                            <button onClick={() => setReportTarget(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                                <FaTimes className="text-xl" />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-white tracking-tight mb-1">{reportTarget.name}&apos;s Report</h2>
                                <p className="text-slate-500 font-medium text-sm">{reportTarget.parentEmail}</p>
                            </div>

                            {reportLoading ? (
                                <div className="py-12 text-center text-slate-500 font-bold">
                                    <FaSpinner className="animate-spin inline-block mr-2" /> Loading...
                                </div>
                            ) : reportData ? (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                                            <FaBookOpen className="text-blue-500 mb-2" />
                                            <p className="text-2xl font-black text-white">{reportData.totalTasksCompleted}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Tasks Done</p>
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                                            <FaStar className="text-amber-400 mb-2" />
                                            <p className="text-2xl font-black text-white">{reportData.totalScore}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Score</p>
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                                            <FaFire className="text-rose-400 mb-2" />
                                            <p className="text-2xl font-black text-white">{reportData.uniqueDaysActive}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Days</p>
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                                            <FaClock className="text-emerald-400 mb-2" />
                                            <p className="text-2xl font-black text-white">{formatMinutes(reportData.totalMinutesActive)}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Time Learning</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                                            <span className="text-slate-500 font-bold">Grade</span>
                                            <span className="text-slate-200 font-bold">{reportData.grade || '—'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                                            <span className="text-slate-500 font-bold">Username</span>
                                            <span className="text-slate-200 font-bold">@{reportData.username || '—'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                                            <span className="text-slate-500 font-bold">Account Created</span>
                                            <span className="text-slate-200 font-bold">{formatDate(reportData.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                                            <span className="text-slate-500 font-bold">First Login</span>
                                            <span className="text-slate-200 font-bold">{formatDate(reportData.firstLoginAt)}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-slate-500 font-bold">Last Active</span>
                                            <span className="text-slate-200 font-bold">{formatDate(reportData.lastActive)}</span>
                                        </div>
                                    </div>

                                    {reportData.subjectsExplored?.length > 0 && (
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Subjects Explored</p>
                                            <div className="flex flex-wrap gap-2">
                                                {reportData.subjectsExplored.map((s) => (
                                                    <span key={s} className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Reset Password Result Modal ── */}
            <AnimatePresence>
                {resetResult && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                    >
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setResetResult(null)} />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-3xl shadow-black/50 text-center"
                        >
                            <button onClick={() => setResetResult(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                                <FaTimes className="text-xl" />
                            </button>
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/20">
                                <FaKey />
                            </div>
                            <h2 className="text-xl font-black text-white mb-1">Password Reset</h2>
                            <p className="text-slate-500 font-medium text-sm mb-6">
                                Share this new password with {resetResult.name}&apos;s parent — it won&apos;t be shown again.
                            </p>
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-3">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Username</p>
                                <p className="text-white font-bold mb-4">@{resetResult.username || '—'}</p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">New Password</p>
                                <p className="text-2xl text-amber-400 font-black tracking-widest font-mono">{resetResult.newPassword}</p>
                            </div>
                            <button
                                onClick={copyPassword}
                                className="w-full py-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl font-bold text-sm hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {copied ? <><FaCheckCircle /> Copied!</> : <><FaCopy /> Copy Password</>}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
