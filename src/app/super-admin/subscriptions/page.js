"use client";
import React, { useState, useEffect } from 'react';
import {
    collection, getDocs, query, orderBy
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { motion } from 'framer-motion';
import {
    FaCreditCard, FaSearch, FaFilter, FaDownload,
    FaCheckCircle, FaExclamationCircle, FaRedo
} from 'react-icons/fa';

export default function SubscriptionsManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // These would typically come from your Stripe webhook synced collection
        const fetchSubs = async () => {
            try {
                const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
                const subscribers = snap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(user => user.subscriptionStatus === 'active');
                setSubscriptions(subscribers);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubs();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-4">
                        <FaCreditCard className="text-purple-500" />
                        Billing & Revenue
                    </h1>
                    <p className="text-slate-500 font-medium font-outfit uppercase tracking-widest text-xs">Monitor subscription cycles and platform earnings</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-bold text-sm border border-slate-700 transition-all">
                        <FaDownload /> Export Report
                    </button>
                </div>
            </div>

            {/* ── Revenue Summary ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Monthly Recurring Revenue', value: '$4,250', color: 'blue' },
                    { label: 'Active Subscriptions', value: subscriptions.length || '12', color: 'emerald' },
                    { label: 'Churn Rate', value: '1.2%', color: 'rose' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2">{stat.label}</p>
                        <h3 className={`text-4xl font-black text-${stat.color}-400 tracking-tighter`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* ── Subscriptions Table ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden">
                <div className="p-8 border-b border-slate-800/50 flex flex-col md:flex-row justify-between gap-4">
                    <h2 className="text-xl font-black text-white">Active Transactions</h2>
                    <div className="flex gap-4">
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                            <select className="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-10 py-3 rounded-xl appearance-none outline-none focus:border-purple-500">
                                <option>All Statuses</option>
                                <option>Active</option>
                                <option>Past Due</option>
                                <option>Canceled</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/30">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Customer</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Plan</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Amount</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500">Next Billing</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[3px] text-slate-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {[
                                { name: 'Sarah Wilson', email: 'sarah@example.com', plan: 'Premium Monthly', amount: '$29.00', date: 'Mar 24, 2026', status: 'Active' },
                                { name: 'Mark Thompson', email: 'mark@example.com', plan: 'Premium Yearly', amount: '$290.00', date: 'Feb 12, 2027', status: 'Active' },
                                { name: 'Elena Rodriguez', email: 'elena@example.com', plan: 'Premium Monthly', amount: '$29.00', date: 'Mar 02, 2026', status: 'Past Due' },
                            ].map((sub, i) => (
                                <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="font-black text-white">{sub.name}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sub.email}</div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-slate-300 font-bold text-sm">{sub.plan}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-white font-black">{sub.amount}</span>
                                    </td>
                                    <td className="px-10 py-6 text-slate-400 font-bold text-sm">
                                        {sub.date}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                            }`}>
                                            {sub.status === 'Active' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                            {sub.status}
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
