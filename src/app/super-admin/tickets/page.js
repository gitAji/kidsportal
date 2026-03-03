"use client";
import React, { useState, useEffect } from 'react';
import {
    collection, getDocs, doc, updateDoc, query, orderBy, serverTimestamp, where
} from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTicketAlt, FaSpinner, FaCheck, FaReply,
    FaExclamationTriangle, FaClock, FaCheckCircle,
    FaTimes, FaFilter, FaInbox
} from 'react-icons/fa';

const STATUS_COLORS = {
    open: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", label: "Open" },
    in_progress: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", label: "In Progress" },
    resolved: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", label: "Resolved" },
    closed: { bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-400", label: "Closed" },
};

const PRIORITY_COLORS = {
    low: "text-slate-400",
    medium: "text-amber-400",
    high: "text-rose-400",
};

export default function TicketManagerPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replying, setReplying] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error("Error fetching tickets:", err);
        }
        setLoading(false);
    };

    const updateTicketStatus = async (ticketId, newStatus) => {
        try {
            await updateDoc(doc(db, 'tickets', ticketId), {
                status: newStatus,
                updatedAt: serverTimestamp(),
            });
            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, status: newStatus } : t
            ));
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const updatePriority = async (ticketId, priority) => {
        try {
            await updateDoc(doc(db, 'tickets', ticketId), {
                priority,
                updatedAt: serverTimestamp(),
            });
            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, priority } : t
            ));
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(prev => ({ ...prev, priority }));
            }
        } catch (err) {
            console.error("Error updating priority:", err);
        }
    };

    const sendReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;
        setReplying(true);
        try {
            const currentResponses = selectedTicket.responses || [];
            const newResponse = {
                by: auth.currentUser?.email || "Admin",
                message: replyText.trim(),
                timestamp: new Date().toISOString(),
            };
            await updateDoc(doc(db, 'tickets', selectedTicket.id), {
                responses: [...currentResponses, newResponse],
                status: "in_progress",
                updatedAt: serverTimestamp(),
            });
            setSelectedTicket(prev => ({
                ...prev,
                responses: [...(prev.responses || []), newResponse],
                status: "in_progress",
            }));
            setTickets(prev => prev.map(t =>
                t.id === selectedTicket.id ? { ...t, status: "in_progress" } : t
            ));
            setReplyText("");
        } catch (err) {
            console.error("Error sending reply:", err);
        }
        setReplying(false);
    };

    const filteredTickets = filterStatus === "all"
        ? tickets
        : tickets.filter(t => (t.status || "open") === filterStatus);

    const statusCounts = {
        all: tickets.length,
        open: tickets.filter(t => !t.status || t.status === "open").length,
        in_progress: tickets.filter(t => t.status === "in_progress").length,
        resolved: tickets.filter(t => t.status === "resolved").length,
        closed: tickets.filter(t => t.status === "closed").length,
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
            <div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">Ticket Manager</h1>
                <p className="text-slate-400 font-medium">View and respond to support tickets from parents and visitors.</p>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {Object.entries({ all: "All", open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed" }).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filterStatus === key
                                ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/30"
                                : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                            }`}
                    >
                        {label} ({statusCounts[key]})
                    </button>
                ))}
            </div>

            {/* Main Layout: Ticket List + Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Ticket List */}
                <div className="lg:col-span-2 space-y-3">
                    {filteredTickets.length === 0 && (
                        <div className="text-center py-16 bg-slate-950 border border-slate-800 rounded-[2rem]">
                            <FaInbox className="text-4xl text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-600 font-bold text-sm">No tickets found</p>
                        </div>
                    )}
                    {filteredTickets.map(ticket => {
                        const status = STATUS_COLORS[ticket.status || "open"] || STATUS_COLORS.open;
                        const isSelected = selectedTicket?.id === ticket.id;
                        return (
                            <motion.button
                                key={ticket.id}
                                layout
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full text-left p-5 rounded-2xl border transition-all ${isSelected
                                        ? "bg-blue-500/5 border-blue-500/30 shadow-lg shadow-blue-900/10"
                                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-grow min-w-0">
                                        <p className="text-white font-bold truncate">{ticket.name}</p>
                                        <p className="text-slate-500 text-xs font-medium truncate">{ticket.email}</p>
                                        <p className="text-blue-400 font-bold text-sm mt-1">{ticket.subject}</p>
                                        <p className="text-slate-600 text-xs mt-1 line-clamp-2">{ticket.message}</p>
                                    </div>
                                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border ${status.text} text-[9px] font-black uppercase tracking-widest`}>
                                        {status.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-600 font-bold">
                                    <span>{ticket.createdAt?.toDate?.() ? ticket.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                                    {ticket.responses?.length > 0 && (
                                        <span className="text-blue-500">{ticket.responses.length} {ticket.responses.length === 1 ? 'reply' : 'replies'}</span>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Ticket Detail */}
                <div className="lg:col-span-3">
                    {selectedTicket ? (
                        <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-8 sticky top-28">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-white">{selectedTicket.subject}</h2>
                                    <p className="text-slate-500 text-sm font-medium mt-0.5">From {selectedTicket.name} &lt;{selectedTicket.email}&gt;</p>
                                    <p className="text-slate-600 text-xs font-bold mt-1">
                                        {selectedTicket.createdAt?.toDate?.() ? selectedTicket.createdAt.toDate().toLocaleString() : 'Recently'}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="text-slate-600 hover:text-slate-400 transition-colors p-2">
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Ticket Actions */}
                            <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-slate-800/50">
                                {/* Status */}
                                <select
                                    value={selectedTicket.status || "open"}
                                    onChange={e => updateTicketStatus(selectedTicket.id, e.target.value)}
                                    className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                                {/* Priority */}
                                <select
                                    value={selectedTicket.priority || "medium"}
                                    onChange={e => updatePriority(selectedTicket.id, e.target.value)}
                                    className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>

                            {/* Original Message */}
                            <div className="mb-6">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Original Message</p>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm leading-relaxed">
                                    {selectedTicket.message}
                                </div>
                            </div>

                            {/* Response Thread */}
                            {selectedTicket.responses?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Responses</p>
                                    <div className="space-y-3">
                                        {selectedTicket.responses.map((r, i) => (
                                            <div key={i} className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-blue-400">{r.by}</span>
                                                    <span className="text-[10px] text-slate-600">
                                                        {r.timestamp ? new Date(r.timestamp).toLocaleString() : ''}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 text-sm">{r.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reply Box */}
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Reply</p>
                                <textarea
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Type your response..."
                                    rows={3}
                                    className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-600"
                                />
                                <button
                                    onClick={sendReply}
                                    disabled={!replyText.trim() || replying}
                                    className="mt-3 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {replying ? <FaSpinner className="animate-spin" /> : <FaReply />}
                                    {replying ? "Sending..." : "Send Reply"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-950 border border-dashed border-slate-800 rounded-[2rem] p-16 flex flex-col items-center justify-center min-h-[400px]">
                            <FaTicketAlt className="text-4xl text-slate-800 mb-4" />
                            <p className="text-slate-600 font-bold text-sm">Select a ticket to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
