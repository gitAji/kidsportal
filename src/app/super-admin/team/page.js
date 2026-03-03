"use client";
import React, { useState, useEffect } from 'react';
import {
    collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsersCog, FaSpinner, FaPlus, FaTimes, FaCheck, FaTrash,
    FaUserShield, FaTicketAlt, FaBookOpen, FaCog, FaArrowLeft
} from 'react-icons/fa';
import Link from 'next/link';

const AVAILABLE_ROLES = [
    { id: "super_admin", label: "Super Admin", icon: <FaUserShield />, color: "violet", desc: "Full platform access" },
    { id: "ticket_manager", label: "Ticket Manager", icon: <FaTicketAlt />, color: "blue", desc: "View and respond to tickets" },
    { id: "content_editor", label: "Content Editor", icon: <FaBookOpen />, color: "emerald", desc: "Manage learning content" },
    { id: "config_manager", label: "Config Manager", icon: <FaCog />, color: "amber", desc: "Manage platform settings" },
];

export default function TeamPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    // New admin form
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newRoles, setNewRoles] = useState([]);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setAdmins(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
        } catch (err) {
            console.error("Error fetching admins:", err);
        }
        setLoading(false);
    };

    const addAdmin = async () => {
        if (!newEmail.trim() || newRoles.length === 0) return;
        setSaving(true);
        try {
            // Use email as doc ID for easy lookup, but store UID mapping when they first login
            const adminId = newEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
            await setDoc(doc(db, 'admins', adminId), {
                email: newEmail.trim().toLowerCase(),
                name: newName.trim() || newEmail.trim(),
                roles: newRoles,
                status: "active",
                createdAt: serverTimestamp(),
            });
            setSaveMsg("Team member added!");
            setNewEmail("");
            setNewName("");
            setNewRoles([]);
            setShowAddForm(false);
            fetchAdmins();
        } catch (err) {
            console.error("Error adding admin:", err);
            setSaveMsg("Error: " + err.message);
        }
        setSaving(false);
        setTimeout(() => setSaveMsg(""), 4000);
    };

    const toggleRole = (adminDocId, roleId) => {
        setAdmins(prev => prev.map(a => {
            if (a.docId === adminDocId) {
                const hasRole = a.roles?.includes(roleId);
                const newRoles = hasRole
                    ? (a.roles || []).filter(r => r !== roleId)
                    : [...(a.roles || []), roleId];
                // Update Firestore
                updateDoc(doc(db, 'admins', adminDocId), { roles: newRoles, updatedAt: serverTimestamp() }).catch(console.error);
                return { ...a, roles: newRoles };
            }
            return a;
        }));
    };

    const toggleStatus = (adminDocId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "suspended" : "active";
        setAdmins(prev => prev.map(a => {
            if (a.docId === adminDocId) {
                updateDoc(doc(db, 'admins', adminDocId), { status: newStatus, updatedAt: serverTimestamp() }).catch(console.error);
                return { ...a, status: newStatus };
            }
            return a;
        }));
    };

    const removeAdmin = async (adminDocId) => {
        if (!confirm("Remove this team member? They will lose all admin access.")) return;
        try {
            await deleteDoc(doc(db, 'admins', adminDocId));
            setAdmins(prev => prev.filter(a => a.docId !== adminDocId));
        } catch (err) {
            console.error("Error removing admin:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FaSpinner className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Team &amp; Roles</h1>
                    <p className="text-slate-400 font-medium">Manage admin team members and assign roles to delegate access.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all"
                >
                    <FaPlus /> Add Team Member
                </button>
            </div>

            {/* Save message */}
            <AnimatePresence>
                {saveMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border text-sm font-bold ${saveMsg.includes("Error")
                                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            }`}
                    >
                        <FaCheck /> {saveMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-white">Add New Team Member</h3>
                                <button onClick={() => setShowAddForm(false)} className="text-slate-600 hover:text-slate-400">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email Address *</label>
                                    <input
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Display Name</label>
                                    <input
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Assign Roles *</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {AVAILABLE_ROLES.map(role => {
                                        const isSelected = newRoles.includes(role.id);
                                        return (
                                            <button
                                                key={role.id}
                                                onClick={() => {
                                                    setNewRoles(prev =>
                                                        prev.includes(role.id)
                                                            ? prev.filter(r => r !== role.id)
                                                            : [...prev, role.id]
                                                    );
                                                }}
                                                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                        ? `bg-${role.color}-500/10 border-${role.color}-500/40 text-${role.color}-400`
                                                        : "bg-slate-900/50 border-slate-800 text-slate-600 hover:border-slate-700"
                                                    }`}
                                            >
                                                <span className="text-lg">{role.icon}</span>
                                                <div>
                                                    <p className="font-bold text-sm">{role.label}</p>
                                                    <p className="text-[10px] text-slate-500">{role.desc}</p>
                                                </div>
                                                {isSelected && <FaCheck className="ml-auto text-xs" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={addAdmin}
                                disabled={!newEmail.trim() || newRoles.length === 0 || saving}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                                {saving ? "Adding..." : "Add Member"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Role Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVAILABLE_ROLES.map(role => (
                    <div key={role.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-lg text-slate-500">{role.icon}</span>
                        <div>
                            <p className="text-xs font-black text-white">{role.label}</p>
                            <p className="text-[10px] text-slate-600">{role.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Members List */}
            <div className="bg-slate-950 border border-slate-800 rounded-[2rem] overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-black text-white">Team Members ({admins.length})</h2>
                </div>

                {admins.length === 0 ? (
                    <div className="p-12 text-center">
                        <FaUsersCog className="text-4xl text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-600 font-bold text-sm">No admin team members yet</p>
                        <p className="text-slate-700 text-xs mt-1">Add your first team member to delegate admin tasks</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800/50">
                        {admins.map(admin => (
                            <div key={admin.docId} className="p-6 hover:bg-slate-900/30 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                                            {(admin.name || admin.email || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{admin.name || admin.email}</p>
                                            <p className="text-slate-500 text-xs font-medium">{admin.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleStatus(admin.docId, admin.status)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${admin.status === "active"
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                                }`}
                                        >
                                            {admin.status === "active" ? "Active" : "Suspended"}
                                        </button>
                                        <button
                                            onClick={() => removeAdmin(admin.docId)}
                                            className="p-2 text-slate-700 hover:text-rose-400 transition-colors"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>

                                {/* Role Toggles */}
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_ROLES.map(role => {
                                        const hasRole = admin.roles?.includes(role.id);
                                        return (
                                            <button
                                                key={role.id}
                                                onClick={() => toggleRole(admin.docId, role.id)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${hasRole
                                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                                        : "bg-slate-900/50 border-slate-800 text-slate-700 hover:border-slate-700"
                                                    }`}
                                            >
                                                {role.icon}
                                                <span>{role.label}</span>
                                                {hasRole && <FaCheck className="text-[10px]" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5">
                    💡
                </div>
                <div>
                    <p className="text-sm font-bold text-white mb-1">How roles work</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Team members log in via the same Super Admin login page using their Google account.
                        Their email is matched against this list. Each member only sees the sections
                        they have been assigned. The Super Admin whitelist email always has full access regardless.
                    </p>
                </div>
            </div>
        </div>
    );
}
